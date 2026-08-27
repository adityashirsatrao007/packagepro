"use client";

import type { PackageComponent } from "@/types";
import { formatPrice } from "@/lib/pricing";

interface ItineraryTimelineProps {
  components: PackageComponent[];
  selectedIds: Set<string>;
}

const slotOrder = ["morning", "afternoon", "evening", "overnight"];

export default function ItineraryTimeline({
  components,
  selectedIds,
}: ItineraryTimelineProps) {
  const byDay: Record<number, Record<string, PackageComponent[]>> = {};

  for (const comp of components) {
    if (!selectedIds.has(comp.component_id)) continue;
    if (!byDay[comp.day_index]) byDay[comp.day_index] = {};
    if (!byDay[comp.day_index][comp.slot]) byDay[comp.day_index][comp.slot] = [];
    byDay[comp.day_index][comp.slot].push(comp);
  }

  const days = Object.keys(byDay)
    .map(Number)
    .sort((a, b) => a - b);

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

  return (
    <div className="space-y-6">
      {days.map((day) => (
        <div key={day}>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {day}
            </span>
            Day {day}
          </h3>

          <div className="ml-4 border-l-2 border-blue-200 pl-4 space-y-3">
            {slotOrder
              .filter((slot) => byDay[day]?.[slot])
              .map((slot) =>
                byDay[day][slot].map((comp) => (
                  <div
                    key={comp.component_id}
                    className="relative flex items-start gap-3"
                  >
                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white" />
                    <span className="text-base mt-0.5">
                      {typeIcons[comp.component_type] || "📦"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {comp.title}
                        </p>
                        <span className="text-xs text-gray-400 capitalize">
                          {slot}
                        </span>
                      </div>
                      {parseFloat(comp.price_delta) !== 0 && (
                        <p
                          className={`text-xs ${
                            parseFloat(comp.price_delta) > 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {parseFloat(comp.price_delta) > 0 ? "+" : ""}
                          {formatPrice(comp.price_delta, comp.currency)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
