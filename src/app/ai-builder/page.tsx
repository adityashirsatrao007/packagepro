"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TourPackage, PackageComponent } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslations } from "@/lib/useTranslations";
import { motion } from "framer-motion";
import { Sparkles, Send, ArrowRight, MapPin, Clock, Star, Loader2 } from "lucide-react";

interface Recommendation {
  package: TourPackage;
  components: PackageComponent[];
  matchScore: number;
  reason: string;
}

const suggestions = [
  { text: "Heritage walk in Rajasthan with a local guide", icon: "🏛️" },
  { text: "Beach honeymoon in Bali, 5 days, luxury", icon: "💑" },
  { text: "Family pilgrimage to Varanasi, budget-friendly", icon: "🙏" },
  { text: "Wildlife safari adventure in Kerala", icon: "🐘" },
  { text: "Food trail across Mumbai and Pune", icon: "🍜" },
  { text: "Wellness retreat in Rishikesh, yoga and meditation", icon: "🧘" },
];

export default function AIBuilderPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = useTranslations();
  const [interests, setInterests] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async () => {
    if (!interests.trim() || loading) return;
    setLoading(true);
    setResponse("");
    setRecommendations([]);
    setShowResults(false);

    try {
      const res = await fetch("/api/ai-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests, budget, language }),
      });
      const data = await res.json();
      setResponse(data.response);
      setRecommendations(data.recommendations || []);
      setTimeout(() => setShowResults(true), 300);
    } catch {
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const themeIcons: Record<string, string> = {
    adventure: "🏔️", heritage: "🏛️", honeymoon: "💕",
    family: "👨‍👩‍👧‍👦", pilgrimage: "🙏", wellness: "🧘",
    wildlife: "🐘", food_trail: "🍽️",
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full text-[13px] text-amber-700 font-bold mb-4 border border-amber-200 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Powered by LLaMA 3.3 70B via Groq
        </div>
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-3 text-[15px] md:text-base max-w-xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm sticky top-24">
            <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Tell us about your trip</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  {t("whatLookingFor")}
                </label>
                <textarea
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder={t("placeholder")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all bg-gray-50 focus:bg-white"
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  {t("budget")}
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder={t("budgetPlaceholder")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !interests.trim()}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 rounded-xl text-[15px] font-bold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t("buildMyPackage")}
                  </>
                )}
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Try these</p>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInterests(s.text)}
                    disabled={loading}
                    className="w-full text-left text-[13px] px-3 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors border border-gray-200 hover:border-blue-200 flex items-center gap-2 font-medium"
                  >
                    <span>{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          {/* AI Response */}
          {response && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-xl mb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-white">PackagePro AI</span>
                  <p className="text-[11px] text-gray-400">Powered by Groq LLaMA 3.3 70B</p>
                </div>
              </div>
              <div className="text-[14px] text-gray-200 whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </div>
          )}

          {/* Recommendation Cards */}
          {showResults && recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-gray-900">
                {t("recommendedPackages")}
              </h3>
              {recommendations.map((rec, idx) => (
                <motion.button
                  key={rec.package.package_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => router.push(`/packages/${rec.package.package_id}`)}
                  className="w-full text-left bg-white rounded-2xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md uppercase tracking-wider">
                          #{idx + 1} Pick
                        </span>
                        <span className="text-lg">{themeIcons[rec.package.theme] || "📦"}</span>
                        <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">{rec.package.theme.replace("_", " ")}</span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {rec.package.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-[13px] text-gray-500">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {rec.package.city_name}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {rec.package.duration_days}D/{rec.package.duration_nights}N
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="capitalize">{rec.package.tier}</span>
                        </span>
                      </div>
                      <p className="text-[12px] text-green-600 mt-2 flex items-center gap-1 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {rec.reason}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading text-xl font-bold text-gray-900">
                        {formatPrice(rec.package.base_price, rec.package.currency)}
                      </p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">per person</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-[12px] px-4 py-2 bg-blue-600 text-white rounded-xl font-bold group-hover:bg-blue-700 transition-colors">
                        View & Customize
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!response && !loading && (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-10 text-center">
              <div className="text-5xl mb-3">✨</div>
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">Describe your dream trip</h3>
              <p className="text-[13px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                Tell us where you want to go, what you want to do, and your budget. Our AI will build the perfect package for you.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
