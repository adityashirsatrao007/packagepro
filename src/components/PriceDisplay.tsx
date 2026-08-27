"use client";

import { useEffect, useRef, useState } from "react";
import type { RepriceResult } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { useTranslations } from "@/lib/useTranslations";

interface PriceDisplayProps {
  result: RepriceResult;
  onBook: () => void;
}

function AnimatedPrice({ value, currency }: { value: string; currency: string }) {
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlash(true);
      setTimeout(() => setFlash(false), 600);

      const start = parseFloat(prevValue.current);
      const end = parseFloat(value);
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * eased;
        setDisplay(current.toFixed(2));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      prevValue.current = value;
    }
  }, [value]);

  return (
    <span className={`price-update inline-block ${flash ? "animate-priceFlash rounded-lg" : ""}`}>
      {formatPrice(display, currency)}
    </span>
  );
}

export default function PriceDisplay({ result, onBook }: PriceDisplayProps) {
  const t = useTranslations("customiser");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">{t("totalPrice")}</h3>
      </div>

      <div className="space-y-3">
        {result.breakdown.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(item.amount, item.currency)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">{t("totalPrice")}</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <AnimatedPrice value={result.total} currency={result.currency} />
          </span>
        </div>
      </div>

      <button
        onClick={onBook}
        className="mt-5 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {t("bookNow")}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        Price updates live as you customise
      </p>
    </div>
  );
}
