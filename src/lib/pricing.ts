import Decimal from "decimal.js";
import type { PackageComponent, RepriceResult, PriceBreakdown } from "@/types";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function reprice(
  basePrice: string,
  currency: string,
  selectedComponents: PackageComponent[],
  guideDayRate: string | null,
  days: number
): RepriceResult {
  const base = new Decimal(basePrice);
  const breakdown: PriceBreakdown[] = [
    { label: "Base package", amount: base.toFixed(2), currency },
  ];

  let componentsTotal = new Decimal(0);
  const grouped: Record<string, Decimal[]> = {};

  for (const comp of selectedComponents) {
    const delta = new Decimal(comp.price_delta);
    if (!delta.isZero()) {
      const key = comp.component_type;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(delta);
    }
  }

  for (const [type, deltas] of Object.entries(grouped)) {
    const typeTotal = deltas.reduce((sum, d) => sum.add(d), new Decimal(0));
    componentsTotal = componentsTotal.add(typeTotal);
    breakdown.push({
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} upgrades`,
      amount: typeTotal.toFixed(2),
      currency,
    });
  }

  let guideTotal = new Decimal(0);
  if (guideDayRate) {
    guideTotal = new Decimal(guideDayRate).mul(days);
    breakdown.push({
      label: `Guide (${days} days)`,
      amount: guideTotal.toFixed(2),
      currency,
    });
  }

  const total = base.add(componentsTotal).add(guideTotal);

  return {
    total: total.toFixed(2),
    currency,
    breakdown,
  };
}

export function formatPrice(amount: string, currency: string): string {
  const num = parseFloat(amount);
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    LKR: "Rs",
    NPR: "Rs",
    AED: "د.إ",
    THB: "฿",
    SGD: "S$",
  };
  const symbol = symbols[currency] || currency + " ";
  return `${symbol}${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
