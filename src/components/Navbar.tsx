"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslations } from "@/lib/useTranslations";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, Plane } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", label: "اردو", flag: "🇵🇰" },
];

export default function Navbar() {
  const { language, setLanguage } = useLanguageStore();
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"
            >
              <Plane className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-heading text-xl font-bold text-gray-900">
              Package<span className="text-blue-600">Pro</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {t("home")}
            </Link>
            <Link
              href="/ai-builder"
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {t("aiBuilder")}
            </Link>
            <Link
              href="/booking"
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {t("myBookings")}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang.flag} {currentLang.label}</span>
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code === "en" ? "en-IN" : `${lang.code}-IN`);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                          language.startsWith(lang.code)
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg">
                {t("home")}
              </Link>
              <Link href="/ai-builder" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg">
                {t("aiBuilder")}
              </Link>
              <Link href="/booking" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg">
                {t("myBookings")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
