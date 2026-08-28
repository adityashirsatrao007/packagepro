"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import type { TourPackage, PackageComponent, TourGuide, RepriceResult } from "@/types";
import { usePackageStore } from "@/store/usePackageStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import ComponentSwapper from "@/components/ComponentSwapper";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import PriceDisplay from "@/components/PriceDisplay";
import GuideSelector from "@/components/GuideSelector";
import { formatPrice } from "@/lib/pricing";
import { useTranslations } from "@/lib/useTranslations";

export default function PackagePage() {
  const params = useParams();
  const router = useRouter();
  const pkgId = params.id as string;
  const { language } = useLanguageStore();
  const t = useTranslations("customiser");

  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [components, setComponents] = useState<PackageComponent[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    selectedComponents,
    selectedGuide,
    guideDayRate,
    setPackage: setPackageInStore,
    swapComponent,
    toggleOptional,
    setGuide,
  } = usePackageStore();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/packages/${pkgId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Package not found");
        return r.json();
      })
      .then((data) => {
        if (data.package) {
          setPkg(data.package);
          setComponents(data.components);
          setPackageInStore(data.package, data.components);
        }
      })
      .catch(() => setPkg(null))
      .finally(() => setLoading(false));
  }, [pkgId, setPackageInStore]);

  const [priceResult, setPriceResult] = useState<RepriceResult | null>(null);

  useEffect(() => {
    if (!pkg) return;
    fetch("/api/reprice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        basePrice: pkg.base_price,
        currency: pkg.currency,
        components: selectedComponents,
        guideDayRate,
        days: pkg.duration_days,
      }),
    })
      .then((r) => r.json())
      .then(setPriceResult);
  }, [pkg, selectedComponents, guideDayRate]);

  const swapGroupMap = useMemo(() => {
    const map: Record<string, PackageComponent[]> = {};
    for (const c of components) {
      if (c.swap_group) {
        if (!map[c.swap_group]) map[c.swap_group] = [];
        map[c.swap_group].push(c);
      }
    }
    return map;
  }, [components]);

  const groupedComponents = useMemo(() => {
    const groups: Record<string, PackageComponent[]> = {};
    for (const c of selectedComponents) {
      if (!groups[c.component_type]) groups[c.component_type] = [];
      groups[c.component_type].push(c);
    }
    return groups;
  }, [selectedComponents]);

  const optionalComponents = useMemo(() => {
    return components.filter(
      (c) =>
        c.is_optional === 1 &&
        !selectedComponents.some((s) => s.component_id === c.component_id)
    );
  }, [components, selectedComponents]);

  const selectedIds = useMemo(
    () => new Set(selectedComponents.map((c) => c.component_id)),
    [selectedComponents]
  );

  const handleBook = () => {
    router.push("/booking");
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="col-span-2 h-96 bg-gray-200 rounded-2xl" />
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!pkg) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-gray-500 text-lg">{t("notFound")}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          {t("backToPackages")}
        </button>
      </main>
    );
  }

  const typeLabels: Record<string, string> = {
    hotel: `🏨 ${t("hotels")}`,
    poi: `📍 ${t("activities")}`,
    transfer: `🚗 ${t("transfers")}`,
    guide: `🗣️ ${t("guide")}`,
    meal: `🍽️ ${t("meals")}`,
    entry_ticket: `🎫 ${t("tickets")}`,
    insurance: `🛡️ ${t("insurance")}`,
    flight: `✈️ ${t("flights")}`,
  };

  const cityImages: Record<string, string> = {
    jaipur: "/images/packages/jaipur.jpg",
    udaipur: "/images/packages/udaipur.jpg",
    jodhpur: "/images/packages/jodhpur.jpg",
    agra: "/images/packages/agra.jpg",
    varanasi: "/images/packages/varanasi.jpg",
    "new delhi": "/images/packages/delhi.jpg",
    mumbai: "/images/packages/mumbai.jpg",
    dubai: "/images/packages/dubai.jpg",
    kolkata: "/images/packages/kolkata.jpg",
    chennai: "/images/packages/chennai.jpg",
    bangkok: "/images/packages/bangkok.jpg",
    singapore: "/images/packages/singapore.jpg",
    kathmandu: "/images/packages/kathmandu.jpg",
    default: "/images/packages/default.jpg",
  };

  const heroImg =
    cityImages[pkg.city_name?.toLowerCase() || ""] ||
    cityImages.default;

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={heroImg}
          alt={pkg.city_name || ""}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-white/70 hover:text-white mb-3 inline-flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t("backToPackages")}
            </button>
            <h1 className="text-3xl font-bold text-white">{pkg.name}</h1>
            <p className="text-white/80 mt-1">
              {pkg.city_name} · {pkg.duration_days}D / {pkg.duration_nights}N ·{" "}
              <span className="capitalize">{pkg.tier}</span> ·{" "}
              <span className="capitalize">{pkg.theme.replace("_", " ")}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Itinerary + Component Swapper */}
          <div className="lg:col-span-2 space-y-6">
            {/* Itinerary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("itinerary")}
              </h2>
              <ItineraryTimeline
                components={components}
                selectedIds={selectedIds}
              />
            </div>

            {/* Component Swapper */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("customiseComponents")}
              </h2>

              {Object.entries(groupedComponents).map(([type, comps]) => (
                <div key={type} className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {typeLabels[type] || type}
                  </h3>
                  <div className="space-y-2">
                    {comps.map((comp) => (
                      <ComponentSwapper
                        key={comp.component_id}
                        component={comp}
                        alternatives={
                          comp.swap_group
                            ? (swapGroupMap[comp.swap_group] || []).filter(
                                (alt) =>
                                  alt.is_swappable === 1 &&
                                  alt.component_id !== comp.component_id
                              )
                            : []
                        }
                        isSelected={true}
                        onSwap={swapComponent}
                        onToggle={toggleOptional}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Optional add-ons */}
              {optionalComponents.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t("optionalAddons")}
                  </h3>
                  <div className="space-y-2">
                    {optionalComponents.map((comp) => (
                      <ComponentSwapper
                        key={comp.component_id}
                        component={comp}
                        alternatives={[]}
                        isSelected={false}
                        onSwap={swapComponent}
                        onToggle={toggleOptional}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Guide Selector */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <GuideSelector
                  cityId={pkg.city_id}
                  language={language}
                  selectedGuide={selectedGuide}
                  onSelect={setGuide}
                />
              </div>
            </div>

            {/* Inclusions/Exclusions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                {pkg.inclusions && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {t("inclusions")}
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {pkg.inclusions.split("|").map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {item.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {t("exclusions")}
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {pkg.exclusions.split("|").map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-500 mt-0.5">✗</span>
                          {item.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Price + Guide */}
          <div className="space-y-6">
            {priceResult && (
              <PriceDisplay result={priceResult} onBook={handleBook} />
            )}

            {/* Save & Share */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert(t("linkCopied") || "Link copied to clipboard!");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {t("share") || "Share"}
                </button>
                <button
                  onClick={() => {
                    const data = {
                      packageId: pkgId,
                      name: pkg.name,
                      city: pkg.city_name,
                      basePrice: pkg.base_price,
                      currency: pkg.currency,
                      selectedComponents: Array.from(selectedComponents),
                      guideId: selectedGuide?.guide_id || null,
                      savedAt: new Date().toISOString(),
                    };
                    const saved = JSON.parse(localStorage.getItem("savedPackages") || "[]");
                    saved.push(data);
                    localStorage.setItem("savedPackages", JSON.stringify(saved));
                    alert(t("saved") || "Package saved!");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm font-medium text-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {t("save") || "Save"}
                </button>
              </div>
            </div>

            {selectedGuide && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {t("selectedGuide")}
                </h3>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedGuide.display_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedGuide.specialisation} · {selectedGuide.years_experience}{t("experience")}
                  </p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {selectedGuide.languages.split(",").map((l) => (
                      <span
                        key={l}
                        className="px-1.5 py-0.5 bg-white text-gray-600 rounded text-xs border border-gray-200"
                      >
                        {l.trim()}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-blue-600 mt-2">
                    {formatPrice(selectedGuide.day_rate, selectedGuide.currency)}{t("perDay")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
