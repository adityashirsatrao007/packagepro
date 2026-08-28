"use client";

import { useEffect, useState } from "react";
import type { RepriceResult } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, TrendingUp, TrendingDown, Check, Sparkles } from "lucide-react";

interface PriceDisplayProps {
  result: RepriceResult;
  onBook: () => void;
}

function AnimatedPrice({ value, currency }: { value: string; currency: string }) {
  const [displayValue, setDisplayValue] = useState("0");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const target = parseFloat(value);
    const start = parseFloat(displayValue) || 0;
    const diff = target - start;
    const duration = 600;
    const startTime = Date.now();

    setFlash(true);
    setTimeout(() => setFlash(false), 400);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;

      if (currency === "IDR" || currency === "THB") {
        setDisplayValue(current.toLocaleString("en-US", { maximumFractionDigits: 0 }));
      } else {
        setDisplayValue(current.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      }

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, currency]);

  return (
    <motion.span
      animate={flash ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="text-3xl font-bold text-gray-900"
    >
      {currency === "IDR" || currency === "THB" ? "" : "₹"}{displayValue}{" "}
      <span className="text-lg font-medium text-gray-400">{currency}</span>
    </motion.span>
  );
}

export default function PriceDisplay({ result, onBook }: PriceDisplayProps) {
  const baseAmount = parseFloat(result.breakdown[0]?.amount || "0");
  const totalAmount = parseFloat(result.total);
  const diff = totalAmount - baseAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm font-semibold text-gray-900">Price Summary</h3>
      </div>

      <div className="mb-4">
        <AnimatedPrice value={result.total} currency={result.currency} />
        <p className="text-sm text-gray-400 mt-1">total for package</p>
      </div>

      <div className="space-y-2 mb-4">
        {result.breakdown.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium text-gray-700">
              {item.currency === "IDR" || item.currency === "THB" ? "" : "₹"}
              {parseFloat(item.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {item.currency}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {diff !== 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${
              diff > 0 ? "bg-red-50 border border-red-100" : "bg-green-50 border border-green-100"
            }`}
          >
            {diff > 0 ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
            <span className={`text-sm font-medium ${diff > 0 ? "text-red-600" : "text-green-600"}`}>
              {diff > 0 ? "+" : ""}{" "}
              {result.currency === "IDR" || result.currency === "THB" ? "" : "₹"}
              {Math.abs(diff).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
              {result.currency} from base
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBook}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        Book Now
      </motion.button>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        <Check className="w-4 h-4 text-green-500" />
        <span className="text-xs text-gray-400">Free cancellation up to 48 hours</span>
      </div>
    </motion.div>
  );
}
