"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import en from "../../messages/en.json";
import hi from "../../messages/hi.json";

const messages: Record<string, Record<string, unknown>> = { en, hi };

export function useTranslations() {
  const { language } = useLanguageStore();
  const locale = language.startsWith("hi") ? "hi" : "en";

  return function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let value: unknown = messages[locale];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }

    if (typeof value !== "string") {
      // Fallback to English
      let fallback: unknown = messages.en;
      for (const k of keys) {
        if (fallback && typeof fallback === "object" && k in fallback) {
          fallback = (fallback as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      return typeof fallback === "string" ? fallback : key;
    }

    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
        value
      );
    }

    return value;
  };
}
