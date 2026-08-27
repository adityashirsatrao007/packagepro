"use client";

import { useState, useEffect } from "react";
import type { TourGuide } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { useTranslations } from "@/lib/useTranslations";

interface GuideSelectorProps {
  cityId: string;
  language: string;
  selectedGuide: TourGuide | null;
  onSelect: (guide: TourGuide | null) => void;
}

const specialisations = [
  { value: "", labelKey: "all" },
  { value: "heritage", labelKey: "heritage" },
  { value: "food", labelKey: "food" },
  { value: "trekking", labelKey: "trekking" },
  { value: "wildlife", labelKey: "wildlife" },
  { value: "photography", labelKey: "photography" },
  { value: "religious", labelKey: "religious" },
  { value: "shopping", labelKey: "shopping" },
  { value: "accessibility", labelKey: "accessibility" },
];

export default function GuideSelector({
  cityId,
  language,
  selectedGuide,
  onSelect,
}: GuideSelectorProps) {
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [loading, setLoading] = useState(false);
  const [specFilter, setSpecFilter] = useState("");
  const t = useTranslations("customiser");

  useEffect(() => {
    setLoading(true);
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 7);
    const startDate = now.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    const params = new URLSearchParams({ cityId });
    if (language) params.set("language", language);
    if (specFilter) params.set("specialisation", specFilter);
    params.set("startDate", startDate);
    params.set("endDate", end);

    fetch(`/api/guides?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load guides");
        return r.json();
      })
      .then((data) => setGuides(data.guides || []))
      .catch(() => setGuides([]))
      .finally(() => setLoading(false));
  }, [cityId, language, specFilter]);

  const getEffectiveRate = (guide: TourGuide): string => {
    if (!guide.availability || guide.availability.length === 0) {
      return guide.day_rate;
    }
    const availableDays = guide.availability.filter(
      (a) => a.is_available === 1
    );
    if (availableDays.length === 0) return guide.day_rate;

    const maxMultiplier = Math.max(
      ...availableDays.map((a) => parseFloat(a.price_multiplier))
    );
    if (maxMultiplier > 1) {
      const rate = parseFloat(guide.day_rate) * maxMultiplier;
      return rate.toFixed(2);
    }
    return guide.day_rate;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {t("guideSelector")} {language && <span className="text-gray-400">({language})</span>}
        </h3>
        {selectedGuide && (
          <button
            onClick={() => onSelect(null)}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            {t("remove")}
          </button>
        )}
      </div>

      <div className="flex gap-1 flex-wrap">
        {specialisations.map((s) => (
          <button
            key={s.value}
            onClick={() => setSpecFilter(s.value)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              specFilter === s.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s.value === "" ? t("guideSelector") : s.value}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-6 text-sm text-gray-500">
          {t("loading")}
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-500">
          {t("noGuides")}
        </div>
      ) : (
        <div className="space-y-2">
          {guides.map((guide) => {
            const avail = guide.availability;
            const availableDays = avail?.filter((a) => a.is_available === 1).length || 0;
            const totalDays = avail?.length || 0;
            const effectiveRate = getEffectiveRate(guide);

            return (
              <button
                key={guide.guide_id}
                onClick={() =>
                  onSelect(
                    selectedGuide?.guide_id === guide.guide_id ? null : guide
                  )
                }
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedGuide?.guide_id === guide.guide_id
                    ? "border-blue-400 bg-blue-50 ring-1 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {guide.display_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {guide.specialisation} · {guide.years_experience}{t("experience")}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-amber-600">
                        ★ {guide.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({guide.review_count})
                      </span>
                    </div>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {guide.languages.split(",").map((l) => (
                        <span
                          key={l}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {l.trim()}
                        </span>
                      ))}
                    </div>
                    {totalDays > 0 && (
                      <p className={`text-xs mt-1.5 ${availableDays > 0 ? "text-green-600" : "text-red-500"}`}>
                        {availableDays > 0
                          ? `${t("available")} ${availableDays}/${totalDays}`
                          : t("unavailable")}
                      </p>
                    )}
                    {guide.certified === 1 && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                        {t("certified")}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(effectiveRate, guide.currency)}
                    </p>
                    <p className="text-xs text-gray-500">{t("perDay")}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
