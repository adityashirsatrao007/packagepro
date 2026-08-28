"use client";

import { useState, useEffect } from "react";
import type { TourPackage } from "@/types";
import PackageCard from "@/components/PackageCard";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslations } from "@/lib/useTranslations";
import { motion } from "framer-motion";
import { Search, Sparkles, Globe, Shield, Zap } from "lucide-react";

export default function HomePage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeFilter, setThemeFilter] = useState("");
  const { language } = useLanguageStore();
  const t = useTranslations("home");

  const themes = [
    { value: "", label: t("allThemes"), icon: "🌍" },
    { value: "adventure", label: t("adventure"), icon: "🏔️" },
    { value: "honeymoon", label: t("honeymoon"), icon: "💑" },
    { value: "pilgrimage", label: t("pilgrimage"), icon: "🙏" },
    { value: "family", label: t("family"), icon: "👨‍👩‍👧‍👦" },
    { value: "heritage", label: t("heritage"), icon: "🏛️" },
    { value: "wellness", label: t("wellness"), icon: "🧘" },
    { value: "wildlife", label: t("wildlife"), icon: "🦁" },
    { value: "food_trail", label: t("foodTrail"), icon: "🍜" },
  ];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (language) params.set("language", language);
    if (themeFilter) params.set("theme", themeFilter);

    fetch(`/api/packages?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => setPackages(data.packages || []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, [language, themeFilter]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[500px] overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="/images/packages/dubai.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/40" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 font-medium mb-6 border border-white/10">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                AI-Powered Travel Planning
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white leading-tight"
            >
              {t("heroTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/70 mt-4 max-w-lg"
            >
              {t("heroSubtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 text-sm border border-white/10">
                <Globe className="w-4 h-4" />
                11 Languages
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 text-sm border border-white/10">
                <Shield className="w-4 h-4" />
                Certified Guides
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 text-sm border border-white/10">
                <Zap className="w-4 h-4" />
                Live Pricing
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4"
        >
          {[
            { label: "Packages", value: "60+", icon: "📦" },
            { label: "Cities", value: "25+", icon: "🏙️" },
            { label: "Guides", value: "120+", icon: "🗣️" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 w-40"
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Theme Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
        >
          {themes.map((theme) => (
            <motion.button
              key={theme.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setThemeFilter(theme.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                themeFilter === theme.value
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span>{theme.icon}</span>
              {theme.label}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Packages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t("curatedPackages")}</h2>
            <p className="text-gray-500 mt-1">{packages.length} packages available</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Search className="w-4 h-4" />
            AI-powered recommendations
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No packages found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <PackageCard key={pkg.package_id} pkg={pkg} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
