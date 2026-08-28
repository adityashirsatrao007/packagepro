"use client";

import { useState, useEffect } from "react";
import { usePackageStore } from "@/store/usePackageStore";
import { formatPrice } from "@/lib/pricing";
import type { RepriceResult } from "@/types";
import Link from "next/link";
import { useTranslations } from "@/lib/useTranslations";
import { motion } from "framer-motion";
import { Check, Copy, Download, Plane, MapPin, Calendar, Users, CreditCard, Shield, ArrowLeft } from "lucide-react";

export default function BookingPage() {
  const { selectedPackage, selectedComponents, selectedGuide, guideDayRate } =
    usePackageStore();
  const [priceResult, setPriceResult] = useState<RepriceResult | null>(null);
  const t = useTranslations();
  const [bookingRef] = useState(() => "BKG-" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [copied, setCopied] = useState(false);

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

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedPackage) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-12 shadow-sm">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-gray-500 text-lg mb-6">
            {t("notFound")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToPackages")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
          <Check className="w-7 h-7 text-green-600" />
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-gray-900">
          {t("bookingConfirmed")}
        </h1>
        <p className="text-gray-500 mt-1.5 text-[15px]">Your trip is all set!</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
        >
          {/* Booking Reference Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-blue-100 font-medium">{t("bookingReference")}</p>
                <p className="font-heading text-xl font-bold text-white tracking-wider">{bookingRef}</p>
              </div>
              <button
                onClick={handleCopyRef}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-[13px] font-semibold transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Package Info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-gray-900">{selectedPackage.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-[13px] text-gray-500">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedPackage.city_name}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedPackage.duration_days}D / {selectedPackage.duration_nights}N
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    1 {selectedPackage.tier}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Components */}
            <div>
              <h3 className="text-[13px] font-bold text-gray-900 mb-2 uppercase tracking-wider">{t("components")}</h3>
              <div className="space-y-1.5">
                {selectedComponents.map((c) => (
                  <div
                    key={c.component_id}
                    className="flex items-center justify-between text-[13px] py-2 px-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700 font-medium">{c.title}</span>
                    <span
                      className={`font-bold ${
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
                <h3 className="text-[13px] font-bold text-gray-900 mb-2 uppercase tracking-wider">{t("guide")}</h3>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-[13px] font-bold">
                      {selectedGuide.display_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">
                        {selectedGuide.display_name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {selectedGuide.specialisation} · {selectedGuide.languages.split(",").join(" ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            {priceResult && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-[13px] font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Price Breakdown
                </h3>
                <div className="space-y-1.5">
                  {priceResult.breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between text-[13px]">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-semibold text-gray-700">
                        {formatPrice(item.amount, item.currency)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-heading text-lg font-bold pt-3 mt-3 border-t border-gray-200">
                  <span>{t("totalPrice")}</span>
                  <span className="text-blue-600">
                    {formatPrice(priceResult.total, priceResult.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Trust Badges */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wider">
              <Shield className="w-4 h-4 inline mr-1" />
              Booking Protection
            </h3>
            <div className="space-y-2.5">
              {[
                "Free cancellation up to 48 hours",
                "Instant confirmation via email",
                "Secure payment processing",
                "24/7 customer support",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[13px]">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-4">
            <h3 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wider">What happens next?</h3>
            <div className="space-y-2.5 text-[13px] text-gray-600">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                <span className="font-medium">Your guide will confirm within 24 hours</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                <span className="font-medium">Receive detailed itinerary via email</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                <span className="font-medium">Show QR code to your guide on arrival</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link
              href="/"
              className="w-full block text-center bg-gray-100 text-gray-700 py-2.5 rounded-xl text-[14px] font-bold hover:bg-gray-200 transition-colors"
            >
              {t("backToPackages")}
            </Link>
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/packages/${selectedPackage.package_id}`;
                navigator.clipboard.writeText(shareUrl);
                alert("Package link copied to clipboard!");
              }}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors"
            >
              Share Package
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center">
            This is a demo booking. No real payment was processed.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
