"use client";

import { useState, useEffect, useRef } from "react";
import type { TourPackage } from "@/types";
import PackageCard from "@/components/PackageCard";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslations } from "@/lib/useTranslations";

export default function HomePage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeFilter, setThemeFilter] = useState("");
  const { language } = useLanguageStore();
  const t = useTranslations("home");
  const [heroVisible, setHeroVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  const themes = [
    { value: "", label: t("allThemes"), icon: "🌍", color: "from-gray-600 to-gray-800" },
    { value: "adventure", label: t("adventure"), icon: "🏔️", color: "from-orange-500 to-red-500" },
    { value: "honeymoon", label: t("honeymoon"), icon: "💑", color: "from-pink-500 to-rose-500" },
    { value: "pilgrimage", label: t("pilgrimage"), icon: "🙏", color: "from-amber-500 to-yellow-500" },
    { value: "family", label: t("family"), icon: "👨‍👩‍👧‍👦", color: "from-emerald-500 to-green-500" },
    { value: "heritage", label: t("heritage"), icon: "🏛️", color: "from-purple-500 to-indigo-500" },
    { value: "wellness", label: t("wellness"), icon: "🧘", color: "from-teal-500 to-cyan-500" },
    { value: "wildlife", label: t("wildlife"), icon: "🦁", color: "from-green-500 to-emerald-500" },
    { value: "food_trail", label: t("foodTrail"), icon: "🍜", color: "from-red-500 to-orange-500" },
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <div
              className={`transition-all duration-700 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/10 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                60 curated packages across 20+ cities
              </span>

              <h1 className="text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                Your Journey,
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Your Way
                </span>
              </h1>

              <p className="text-lg text-gray-300 mt-6 max-w-lg leading-relaxed">
                Curated tour packages you can customise piece by piece. Swap
                hotels, add guides, change activities — watch the price update
                live.
              </p>
            </div>

            <div
              className={`flex gap-3 mt-8 transition-all duration-700 delay-200 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <a
                href="#packages"
                className="px-7 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                Browse Packages
              </a>
              <a
                href="/ai-builder"
                className="px-7 py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm hover:-translate-y-0.5"
              >
                ✨ AI Builder
              </a>
            </div>

            <div
              className={`flex items-center gap-8 mt-10 transition-all duration-700 delay-400 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {[
                { icon: "✓", text: "60+ packages" },
                { icon: "⚡", text: "Live repricing" },
                { icon: "🌐", text: "11 languages" },
                { icon: "🤖", text: "AI recommendations" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-blue-400 font-bold">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div
          className={`absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block transition-all duration-1000 delay-500 ${
            heroVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
            {[
              { num: "60", label: "Packages" },
              { num: "420", label: "Components" },
              { num: "120", label: "Guides" },
              { num: "20+", label: "Cities" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.num}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section
        id="packages"
        ref={sectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("heroTitle")}
            </h2>
            <p className="text-gray-500 mt-1">
              {t("packagesFound", { count: packages.length })}
            </p>
          </div>
        </div>

        {/* Theme filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setThemeFilter(theme.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                themeFilter === theme.value
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <span className="mr-1.5">{theme.icon}</span>
              {theme.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">{t("packagesFound", { count: 0 })}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.package_id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
