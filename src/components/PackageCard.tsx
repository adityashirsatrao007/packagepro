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
  "agra": "/images/packages/agra.jpg",
  "ahmedabad": "/images/packages/ahmedabad.jpg",
  "alleppey": "/images/packages/alleppey.jpg",
  "amritsar": "/images/packages/amritsar.jpg",
  "aurangabad": "/images/packages/aurangabad.jpg",
  "bali": "/images/packages/bali.jpg",
  "bangkok": "/images/packages/bangkok.jpg",
  "bengaluru": "/images/packages/bengaluru.jpg",
  "bhubaneswar": "/images/packages/bhubaneswar.jpg",
  "bhuj": "/images/packages/bhuj.jpg",
  "chennai": "/images/packages/chennai.jpg",
  "colombo": "/images/packages/colombo.jpg",
  "darjeeling": "/images/packages/darjeeling.jpg",
  "doha": "/images/packages/doha.jpg",
  "dubai": "/images/packages/dubai.jpg",
  "gangtok": "/images/packages/gangtok.jpg",
  "goa": "/images/packages/goa.jpg",
  "gokarna": "/images/packages/gokarna.jpg",
  "guwahati": "/images/packages/guwahati.jpg",
  "hampi": "/images/packages/hampi.jpg",
  "hyderabad": "/images/packages/hyderabad.jpg",
  "jaipur": "/images/packages/jaipur.jpg",
  "jaisalmer": "/images/packages/jaisalmer.jpg",
  "jodhpur": "/images/packages/jodhpur.jpg",
  "kandy": "/images/packages/kandy.jpg",
  "kathmandu": "/images/packages/kathmandu.jpg",
  "kochi": "/images/packages/kochi.jpg",
  "kolkata": "/images/packages/kolkata.jpg",
  "kuala lumpur": "/images/packages/kuala-lumpur.jpg",
  "kyoto": "/images/packages/kyoto.jpg",
  "leh": "/images/packages/leh.jpg",
  "lucknow": "/images/packages/lucknow.jpg",
  "madurai": "/images/packages/madurai.jpg",
  "male": "/images/packages/male.jpg",
  "manali": "/images/packages/manali.jpg",
  "mumbai": "/images/packages/mumbai.jpg",
  "munnar": "/images/packages/munnar.jpg",
  "mysuru": "/images/packages/mysuru.jpg",
  "nainital": "/images/packages/nainital.jpg",
  "new delhi": "/images/packages/delhi.jpg",
  "ooty": "/images/packages/ooty.jpg",
  "panaji": "/images/packages/panaji.jpg",
  "pokhara": "/images/packages/pokhara.jpg",
  "pondicherry": "/images/packages/pondicherry.jpg",
  "pune": "/images/packages/pune.jpg",
  "puri": "/images/packages/puri.jpg",
  "rishikesh": "/images/packages/rishikesh.jpg",
  "shillong": "/images/packages/shillong.jpg",
  "shimla": "/images/packages/shimla.jpg",
  "singapore": "/images/packages/singapore.jpg",
  "srinagar": "/images/packages/srinagar.jpg",
  "thanjavur": "/images/packages/thanjavur.jpg",
  "thimphu": "/images/packages/thimphu.jpg",
  "thiruvananthapuram": "/images/packages/thiruvananthapuram.jpg",
  "tirupati": "/images/packages/tirupati.jpg",
  "udaipur": "/images/packages/udaipur.jpg",
  "varanasi": "/images/packages/varanasi.jpg",
  "visakhapatnam": "/images/packages/visakhapatnam.jpg",
  "wayanad": "/images/packages/wayanad.jpg",
  "zurich": "/images/packages/zurich.jpg",
  "abu dhabi": "/images/packages/abu-dhabi.jpg",
  "default": "/images/packages/default.jpg",
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
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={imgSrc}
              alt={pkg.city_name || ""}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className={`absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r ${gradient} text-white text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-lg`}>
              <span>{themeIcon}</span>
              <span>{pkg.theme.replace("_", " ")}</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-heading text-lg font-bold text-white drop-shadow-lg leading-tight">{pkg.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-white/80" />
                <span className="text-[13px] font-medium text-white/90">{pkg.city_name}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center justify-between text-[13px] text-gray-500 mb-3">
              <div className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{pkg.duration_days}D / {pkg.duration_nights}N</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-gray-700 capitalize">{pkg.tier}</span>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">From</p>
                <p className="font-heading text-[22px] font-bold text-gray-900 leading-none">
                  {formatPrice(pkg.base_price, pkg.currency)}
                </p>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">per person</p>
              </div>
              <motion.div
                whileHover={{ x: 4 }}
                className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
