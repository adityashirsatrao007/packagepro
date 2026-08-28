"use client";

import Link from "next/link";
import type { TourPackage } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";

interface PackageCardProps {
  pkg: TourPackage;
  index?: number;
}

const themeGradients: Record<string, string> = {
  adventure: "from-emerald-500 to-teal-600",
  heritage: "from-amber-500 to-orange-600",
  honeymoon: "from-pink-500 to-rose-600",
  family: "from-blue-500 to-indigo-600",
  pilgrimage: "from-purple-500 to-violet-600",
  wellness: "from-cyan-500 to-sky-600",
  wildlife: "from-lime-500 to-green-600",
  food_trail: "from-red-500 to-rose-600",
};

const themeIcons: Record<string, string> = {
  adventure: "🏔️",
  heritage: "🏛️",
  honeymoon: "💕",
  family: "👨‍👩‍👧‍👦",
  pilgrimage: "🙏",
  wellness: "🧘",
  wildlife: "🐘",
  food_trail: "🍽️",
};

const cityImages: Record<string, string> = {
  jaipur: "/images/packages/jaipur.jpg",
  udaipur: "/images/packages/udaipur.jpg",
  jodhpur: "/images/packages/jodhpur.jpg",
  agra: "/images/packages/agra.jpg",
  varanasi: "/images/packages/varanasi.jpg",
  mumbai: "/images/packages/mumbai.jpg",
  dubai: "/images/packages/dubai.jpg",
  bali: "/images/packages/bali.jpg",
  bangkok: "/images/packages/bangkok.jpg",
  singapore: "/images/packages/singapore.jpg",
  kathmandu: "/images/packages/kathmandu.jpg",
  kolkata: "/images/packages/kolkata.jpg",
  chennai: "/images/packages/chennai.jpg",
  delhi: "/images/packages/delhi.jpg",
  manali: "/images/packages/manali.jpg",
  goa: "/images/packages/goa.jpg",
  rishikesh: "/images/packages/rishikesh.jpg",
  kyoto: "/images/packages/kyoto.jpg",
  zurich: "/images/packages/zurich.jpg",
  default: "/images/packages/default.jpg",
};

export default function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  const gradient = themeGradients[pkg.theme] || "from-gray-500 to-gray-600";
  const themeIcon = themeIcons[pkg.theme] || "📦";
  const imgSrc = cityImages[pkg.city_name?.toLowerCase() || ""] || cityImages.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/packages/${pkg.package_id}`} className="block group">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={imgSrc}
              alt={pkg.city_name || ""}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className={`absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-lg`}>
              <span>{themeIcon}</span>
              <span className="capitalize">{pkg.theme.replace("_", " ")}</span>
            </div>
            <div className="absolute bottom-3 left-3">
              <h3 className="text-lg font-bold text-white drop-shadow-lg">{pkg.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-white/80" />
                <span className="text-sm text-white/90">{pkg.city_name}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{pkg.duration_days}D / {pkg.duration_nights}N</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-medium text-gray-700 capitalize">{pkg.tier}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(pkg.base_price, pkg.currency)}
                </p>
                <p className="text-xs text-gray-400">per person</p>
              </div>
              <motion.div
                whileHover={{ x: 4 }}
                className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
