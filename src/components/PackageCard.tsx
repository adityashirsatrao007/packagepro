"use client";

import Link from "next/link";
import type { TourPackage } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { useTranslations } from "@/lib/useTranslations";

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
  kochi: "/images/packages/kochi.jpg",
  rishikesh: "/images/packages/rishikesh.jpg",
  manali: "/images/packages/manali.jpg",
  darjeeling: "/images/packages/darjeeling.jpg",
  hampi: "/images/packages/hampi.jpg",
  panaji: "/images/packages/goa.jpg",
  bali: "/images/packages/bali.jpg",
  kyoto: "/images/packages/kyoto.jpg",
  zurich: "/images/packages/zurich.jpg",
};

const themeGradients: Record<string, string> = {
  adventure: "from-orange-600 to-red-600",
  honeymoon: "from-pink-500 to-rose-500",
  pilgrimage: "from-amber-500 to-yellow-500",
  family: "from-emerald-500 to-green-500",
  heritage: "from-purple-600 to-indigo-600",
  wellness: "from-teal-500 to-cyan-500",
  wildlife: "from-green-600 to-emerald-600",
  food_trail: "from-red-500 to-orange-500",
};

const tierStyles: Record<string, string> = {
  standard: "bg-white/90 text-gray-800",
  deluxe: "bg-blue-500/90 text-white",
  premium: "bg-gradient-to-r from-amber-400 to-orange-400 text-white",
};

interface PackageCardProps {
  pkg: TourPackage;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const t = useTranslations("home");
  const imgSrc =
    cityImages[pkg.city_name?.toLowerCase() || ""] ||
    "/images/packages/default.jpg";
  const gradient = themeGradients[pkg.theme] || "from-gray-600 to-gray-800";

  const themeLabelKey = pkg.theme === "food_trail" ? "foodTrail" : pkg.theme;

  return (
    <Link
      href={`/packages/${pkg.package_id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 card-hover"
    >
      <div className="h-52 relative overflow-hidden">
        <img
          src={imgSrc}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Theme badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient} text-white shadow-lg`}
          >
            {t(themeLabelKey)}
          </span>
        </div>

        {/* Tier badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tierStyles[pkg.tier]} backdrop-blur-sm`}
          >
            {pkg.tier.charAt(0).toUpperCase() + pkg.tier.slice(1)}
          </span>
        </div>

        {/* Duration overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            {t("days", { count: pkg.duration_days })} / {t("nights", { count: pkg.duration_nights })}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {pkg.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-sm text-gray-500">{pkg.city_name}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {t("perPerson")}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(pkg.base_price, pkg.currency)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {pkg.languages_offered
            .split(",")
            .slice(0, 3)
            .map((lang) => (
              <span
                key={lang}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
              >
                {lang.trim()}
              </span>
            ))}
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-500 capitalize">
            {pkg.difficulty}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
            <span>{t("customise")}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
