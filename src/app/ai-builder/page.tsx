"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TourPackage, PackageComponent } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslations } from "@/lib/useTranslations";

interface Recommendation {
  package: TourPackage;
  components: PackageComponent[];
  matchScore: number;
  reason: string;
}

const suggestions = [
  "Heritage walk in Rajasthan with a local guide",
  "Beach honeymoon in Bali, 5 days, luxury",
  "Family pilgrimage to Varanasi, budget-friendly",
  "Wildlife safari adventure in Kerala",
  "Food trail across Mumbai and Pune",
  "Wellness retreat in Rishikesh, yoga and meditation",
];

export default function AIBuilderPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = useTranslations("aiBuilder");
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

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full text-sm text-blue-700 font-medium mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Powered by LLaMA 3.3 70B
        </div>
        <h1 className="text-4xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 mt-2 text-lg">{t("subtitle")}</p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("whatLookingFor")}
            </label>
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("budget")}
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={t("budgetPlaceholder")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Quick suggestions */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Try these:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInterests(s)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100 hover:border-blue-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !interests.trim()}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Thinking...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t("buildMyPackage")}
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Response */}
      {response && (
        <div className="mt-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-blue-300">{t("packageProAI")}</span>
          </div>
          <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
            {response}
          </div>
        </div>
      )}

      {/* Recommendation Cards */}
      {showResults && recommendations.length > 0 && (
        <div className="mt-6 space-y-4 animate-fadeInUp">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("recommendedPackages")}
          </h3>
          <div className="grid gap-4">
            {recommendations.map((rec, idx) => (
              <button
                key={rec.package.package_id}
                onClick={() => router.push(`/packages/${rec.package.package_id}`)}
                className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                        #{idx + 1} Pick
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{rec.package.theme.replace("_", " ")}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                      {rec.package.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {rec.package.city_name} · {rec.package.duration_days}D/{rec.package.duration_nights}N · {rec.package.tier}
                    </p>
                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {rec.reason}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(rec.package.base_price, rec.package.currency)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">per person</p>
                    <span className="inline-block mt-2 text-xs px-3 py-1 bg-blue-600 text-white rounded-lg font-medium group-hover:bg-blue-700 transition-colors">
                      View & Customize
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
