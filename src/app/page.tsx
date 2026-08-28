"use client";

import { useState, useEffect } from "react";
import type { TourPackage } from "@/types";
import PackageCard from "@/components/PackageCard";
import { useLanguageStore } from "@/store/useLanguageStore";
import { motion } from "framer-motion";
import { Search, Sparkles, Globe, Shield, Zap } from "lucide-react";

export default function HomePage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeFilter, setThemeFilter] = useState("");
  const { language } = useLanguageStore();

  const themes = [
    { value: "", label: language.startsWith("hi") ? "सभी" : "All", icon: "🌍" },
    { value: "adventure", label: language.startsWith("hi") ? "साहसिक" : "Adventure", icon: "🏔️" },
    { value: "honeymoon", label: language.startsWith("hi") ? "हनीमून" : "Honeymoon", icon: "💑" },
    { value: "pilgrimage", label: language.startsWith("hi") ? "तीर्थयात्रा" : "Pilgrimage", icon: "🙏" },
    { value: "family", label: language.startsWith("hi") ? "परिवार" : "Family", icon: "👨‍👩‍👧‍👦" },
    { value: "heritage", label: language.startsWith("hi") ? "विरासत" : "Heritage", icon: "🏛️" },
    { value: "wellness", label: language.startsWith("hi") ? "कल्याण" : "Wellness", icon: "🧘" },
    { value: "wildlife", label: language.startsWith("hi") ? "वन्यजीव" : "Wildlife", icon: "🦁" },
    { value: "food_trail", label: language.startsWith("hi") ? "खाद्य पथ" : "Food Trail", icon: "🍜" },
  ];

  useEffect(() => {
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
      <section className="relative h-[480px] overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="/images/packages/varanasi.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full text-sm text-amber-300 font-semibold mb-6 border border-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI-Powered Travel Planning
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
            >
              {language.startsWith("hi") ? "अपनी परफेक्ट ट्रिप बनाएं" : "Curated Travel Packages"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 mt-6 max-w-lg leading-relaxed"
            >
              {language.startsWith("hi")
                ? "AI-संचालित यात्रा योजना जो आपके बजट और रुचियों के अनुरूप है"
                : "AI-powered travel planning tailored to your budget and interests"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <a href="/ai-builder" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-[15px] font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50">
                <Sparkles className="w-4 h-4" />
                Build with AI
              </a>
              <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 text-[13px] font-semibold border border-white/10">
                <Globe className="w-4 h-4" />
                11 Languages
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 text-[13px] font-semibold border border-white/10">
                <Shield className="w-4 h-4" />
                120+ Certified Guides
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 text-[13px] font-semibold border border-white/10">
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
          transition={{ duration: 0.7, delay: 0.4 }}
          className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4"
        >
          {[
            { label: "Packages", value: "60+", icon: "📦", color: "from-blue-500/20 to-blue-600/20" },
            { label: "Cities", value: "60+", icon: "🏙️", color: "from-emerald-500/20 to-emerald-600/20" },
            { label: "Guides", value: "120+", icon: "🗣️", color: "from-amber-500/20 to-amber-600/20" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl rounded-2xl p-5 border border-white/10 w-40 hover:border-white/20 transition-colors`}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="font-heading text-2xl font-bold text-white mt-2">{stat.value}</p>
              <p className="text-sm font-medium text-white/50 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Theme Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
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
              onClick={() => { setLoading(true); setThemeFilter(theme.value); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all ${
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
              {language.startsWith("hi") ? "चयनित पैकेज" : "Curated Packages"}
            </h2>
            <p className="text-gray-500 mt-1 text-[13px] font-medium">{packages.length} packages available</p>
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500">
            <Search className="w-4 h-4" />
            AI-powered recommendations
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-3">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg, idx) => (
              <PackageCard key={pkg.package_id} pkg={pkg} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
