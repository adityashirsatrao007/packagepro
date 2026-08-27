"use client";

import { useState } from "react";
import type { PackageComponent } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { useTranslations } from "@/lib/useTranslations";

interface ComponentSwapperProps {
  component: PackageComponent;
  alternatives: PackageComponent[];
  isSelected: boolean;
  onSwap: (oldComp: PackageComponent, newComp: PackageComponent) => void;
  onToggle: (comp: PackageComponent) => void;
}

export default function ComponentSwapper({
  component,
  alternatives,
  isSelected,
  onSwap,
  onToggle,
}: ComponentSwapperProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [justSwapped, setJustSwapped] = useState(false);
  const t = useTranslations("customiser");

  const typeIcons: Record<string, string> = {
    hotel: "🏨",
    poi: "📍",
    transfer: "🚗",
    guide: "🗣️",
    meal: "🍽️",
    entry_ticket: "🎫",
    insurance: "🛡️",
    flight: "✈️",
  };

  const handleSwap = (oldComp: PackageComponent, newComp: PackageComponent) => {
    onSwap(oldComp, newComp);
    setJustSwapped(true);
    setTimeout(() => setJustSwapped(false), 600);
  };

  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-300 ${
        justSwapped
          ? "border-blue-400 bg-blue-50 shadow-md shadow-blue-100"
          : isSelected
            ? "border-blue-200 bg-blue-50/50 hover:border-blue-300"
            : "border-gray-200 bg-gray-50 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <span className="text-lg mt-0.5 transition-transform duration-300 group-hover:scale-110">
            {typeIcons[component.component_type] || "📦"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {component.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Day {component.day_index} · {component.slot}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {component.is_optional === 1 ? (
            <button
              onClick={() => onToggle(component)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isSelected ? t("remove") : t("add")}
            </button>
          ) : null}

          {component.is_swappable === 1 &&
            alternatives.length > 0 &&
            isSelected && (
              <button
                onClick={() => setShowAlternatives(!showAlternatives)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-200 ${
                  showAlternatives
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {t("swap")} ({alternatives.length})
              </button>
            )}
        </div>
      </div>

      {isSelected && parseFloat(component.price_delta) !== 0 && (
        <p
          className={`text-xs mt-1.5 ml-7 font-medium ${
            parseFloat(component.price_delta) > 0
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {parseFloat(component.price_delta) > 0 ? "+" : ""}
          {formatPrice(component.price_delta, component.currency)}
        </p>
      )}

      {showAlternatives && (
        <div className="mt-3 ml-7 space-y-1.5 animate-slideInLeft">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {t("swap")}
          </p>
          {alternatives
            .filter((alt) => alt.component_id !== component.component_id)
            .map((alt, idx) => (
              <button
                key={alt.component_id}
                onClick={() => handleSwap(component, alt)}
                className="w-full text-left p-2.5 rounded-lg border text-sm transition-all duration-200 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm animate-fadeIn"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{alt.title}</p>
                  <p
                    className={`text-xs font-medium ${
                      parseFloat(alt.price_delta) > 0
                        ? "text-red-500"
                        : parseFloat(alt.price_delta) < 0
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {parseFloat(alt.price_delta) > 0 ? "+" : ""}
                    {formatPrice(alt.price_delta, alt.currency)}
                  </p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
