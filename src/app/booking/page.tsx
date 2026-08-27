"use client";

import { useState, useEffect } from "react";
import { usePackageStore } from "@/store/usePackageStore";
import { formatPrice } from "@/lib/pricing";
import type { RepriceResult } from "@/types";
import Link from "next/link";
import { useTranslations } from "@/lib/useTranslations";

export default function BookingPage() {
  const { selectedPackage, selectedComponents, selectedGuide, guideDayRate } =
    usePackageStore();
  const [priceResult, setPriceResult] = useState<RepriceResult | null>(null);
  const t = useTranslations("booking");

  useEffect(() => {
    if (!selectedPackage) return;
    fetch("/api/reprice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: selectedPackage.base_price,
        currency: selectedPackage.currency,
        components: selectedComponents,
        guideDayRate,
        days: selectedPackage.duration_days,
      }),
    })
      .then((r) => r.json())
      .then(setPriceResult);
  }, [selectedPackage, selectedComponents, guideDayRate]);

  if (!selectedPackage) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">
          {t("notFound")}
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {t("backToPackages")} →
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t("title")}
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Package Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedPackage.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {selectedPackage.city_name} · {selectedPackage.duration_days}D /{" "}
            {selectedPackage.duration_nights}N · {selectedPackage.tier}
          </p>
        </div>

        {/* Selected Components */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {t("components")}
          </h3>
          <div className="space-y-2">
            {selectedComponents.map((c) => (
              <div
                key={c.component_id}
                className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{c.title}</span>
                <span
                  className={`font-medium ${
                    parseFloat(c.price_delta) > 0
                      ? "text-red-600"
                      : parseFloat(c.price_delta) < 0
                        ? "text-green-600"
                        : "text-gray-500"
                  }`}
                >
                  {parseFloat(c.price_delta) !== 0
                    ? `${parseFloat(c.price_delta) > 0 ? "+" : ""}${formatPrice(c.price_delta, c.currency)}`
                    : "Included"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guide */}
        {selectedGuide && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {t("guide")}
            </h3>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-900">
                {selectedGuide.display_name}
              </p>
              <p className="text-xs text-gray-500">
                {selectedGuide.specialisation} ·{" "}
                {selectedGuide.languages.split(",").join(" ")}
              </p>
            </div>
          </div>
        )}

        {/* Price Summary */}
        {priceResult && (
          <div className="pt-4 border-t border-gray-200 space-y-2">
            {priceResult.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">
                  {formatPrice(item.amount, item.currency)}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span>{t("totalPrice")}</span>
              <span className="text-blue-600">
                {formatPrice(priceResult.total, priceResult.currency)}
              </span>
            </div>
          </div>
        )}

        {/* Mock Booking */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">{t("bookingConfirmed")}</p>
          <p className="text-sm text-green-700 mt-1">
            {t("bookingReference")}: BKG-
            {Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
          <p className="text-xs text-green-600 mt-2">
            This is a demo booking. No real payment was processed.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 text-center bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {t("backToPackages")}
          </Link>
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/packages/${selectedPackage.package_id}`;
              navigator.clipboard.writeText(shareUrl);
              alert("Package link copied to clipboard!");
            }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Share Package
          </button>
        </div>
      </div>
    </main>
  );
}
