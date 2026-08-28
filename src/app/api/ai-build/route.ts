import { NextRequest } from "next/server";
import { getPackages, getPackageComponents } from "@/lib/db";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { interests, budget, language, city } = body as {
    interests: string;
    budget: string;
    language: string;
    city?: string;
  };

  const allPackages = getPackages(language);
  const topPackages = allPackages.slice(0, 25);

  const packageSummaries = topPackages.map((p) => {
    const comps = getPackageComponents(p.package_id);
    return {
      id: p.package_id,
      name: p.name,
      city: p.city_name,
      theme: p.theme,
      tier: p.tier,
      days: p.duration_days,
      nights: p.duration_nights,
      price: p.base_price,
      currency: p.currency,
      difficulty: p.difficulty,
      languages: p.languages_offered,
      components: comps.slice(0, 6).map((c) => `${c.component_type}:${c.title}`),
    };
  });

  const isHindi = language.startsWith("hi");
  const systemPrompt = isHindi
    ? `IMPORTANT: You MUST respond entirely in Hindi (Devanagari script). Do NOT use English in your response. Every word must be in Hindi.

तू PackagePro AI है — एक एक्सपर्ट ट्रैवल एडवाइज़र। तू यात्रियों को ट्रिप ढूंढने और कस्टमाइज़ करने में मदद करता है।

उपलब्ध पैकेज:
${JSON.stringify(packageSummaries)}

नियम:
- सिर्फ ऊपर दिए गए पैकेज में से recommend कर — exact IDs (pkg_xxx) use कर
- हर recommendation में बता: price, duration, city, theme
- Budget हो तो सिर्फ उसके अंदर वाले दिखा
- POORI HINDI में बात कर — English में एक भी word नहीं आना चाहिए
- 3-5 sentences per recommendation

Last line में ये दे:
RECOMMENDATIONS: pkg_id1,pkg_id2,pkg_id3`
    : `You are PackagePro AI — an expert travel advisor for a tour package platform. You help travellers find and customise the perfect trip.

Available packages from our database:
${JSON.stringify(packageSummaries)}

RULES:
- ONLY recommend from the packages listed above — use their exact IDs (pkg_xxx)
- Explain WHY each recommendation fits
- Mention: price, duration, city, theme, what's included
- If they mention a budget, only recommend packages within it
- Be conversational, enthusiastic, helpful
- Keep to 3-5 sentences per recommendation
- Format: **bold** for package names

You MUST respond with valid JSON at the end. After your natural language response, add a line with:
RECOMMENDATIONS: pkg_id1,pkg_id2,pkg_id3`;

  const userMessage = isHindi
    ? `[ LANGUAGE: HINDI — respond ONLY in Hindi/Devanagari ] "${interests}" के लिए पैकेज ढूंढ${budget ? `\nबजट: ${budget}` : ""}${city ? `\nशहर: ${city}` : ""}`
    : `Find packages for: "${interests}"${budget ? `\nBudget: ${budget}` : ""}${city ? `\nCity: ${city}` : ""}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: "You must respond in Hindi only. No English words allowed." },
          { role: "assistant", content: "ठीक है, मैं हिंदी में जवाब दूँगा।" },
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) throw new Error(`Groq API: ${response.status}`);

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    let responseText = rawText;
    let matchedIds: string[] = [];

    const recLine = rawText.match(/RECOMMENDATIONS:\s*(.+)/i);
    if (recLine) {
      matchedIds = recLine[1].split(",").map((s: string) => s.trim()).filter((s: string) => s.startsWith("pkg_"));
      responseText = rawText.replace(/\n?RECOMMENDATIONS:\s*.+/i, "").trim();
    }

    if (matchedIds.length === 0) {
      for (const pkg of topPackages) {
        if (
          rawText.toLowerCase().includes(pkg.name.toLowerCase()) ||
          rawText.toLowerCase().includes(pkg.city_name?.toLowerCase() || "") ||
          rawText.toLowerCase().includes(pkg.theme.replace("_", " "))
        ) {
          matchedIds.push(pkg.package_id);
        }
      }
      matchedIds = [...new Set(matchedIds)].slice(0, 3);
    }

    // If Hindi requested but response is English, regenerate in Hindi
    if (isHindi && !/[\u0900-\u097F]/.test(responseText) && matchedIds.length > 0) {
      const hindiThemes: Record<string, string> = {
        adventure: "साहसिक", heritage: "विरासत", honeymoon: "हनीमून",
        family: "परिवार", pilgrimage: "तीर्थयात्रा", wellness: "कल्याण",
        wildlife: "वन्यजीव", food_trail: "खाद्य पथ",
      };
      const lines = matchedIds.map((id) => {
        const pkg = topPackages.find((p) => p.package_id === id);
        if (!pkg) return "";
        const themeHindi = hindiThemes[pkg.theme] || pkg.theme;
        return `**${pkg.name}** (${themeHindi}) — ${pkg.duration_days} दिन/${pkg.duration_nights} रात | ${pkg.base_price} ${pkg.currency}`;
      }).filter(Boolean);
      responseText = `आपकी "${interests}" रुचि के लिए${budget ? ` और ${budget} बजट में` : ""}, ये पैकेज बेहतरीन हैं:\n\n${lines.join("\n\n")}`;
    }

    const recommendations = matchedIds.map((id) => {
      const pkg = topPackages.find((p) => p.package_id === id);
      if (!pkg) return null;
      const components = getPackageComponents(id);
      return { package: pkg, components, matchScore: 10, reason: "AI recommended" };
    }).filter(Boolean);

    return Response.json({ response: responseText, recommendations });
  } catch {
    const scored = allPackages.map((pkg) => {
      let score = 0;
      const interestLower = interests.toLowerCase();
      const desc = (pkg.description || "").toLowerCase();
      const theme = pkg.theme.toLowerCase();
      const name = pkg.name.toLowerCase();

      if (interestLower.includes("adventure") && theme === "adventure") score += 10;
      if (interestLower.includes("honeymoon") && theme === "honeymoon") score += 10;
      if (interestLower.includes("pilgrimage") && theme === "pilgrimage") score += 10;
      if (interestLower.includes("family") && theme === "family") score += 10;
      if (interestLower.includes("heritage") && theme === "heritage") score += 10;
      if (interestLower.includes("wellness") && theme === "wellness") score += 10;
      if (interestLower.includes("wildlife") && theme === "wildlife") score += 10;
      if (interestLower.includes("food") && theme === "food_trail") score += 10;

      const keywords = interestLower.split(/\s+/);
      for (const kw of keywords) {
        if (kw.length > 2 && desc.includes(kw)) score += 2;
        if (kw.length > 2 && name.includes(kw)) score += 3;
      }

      if (budget) {
        const budgetNum = parseFloat(budget);
        const priceNum = parseFloat(pkg.base_price);
        if (!isNaN(budgetNum) && !isNaN(priceNum)) {
          if (priceNum <= budgetNum) score += 5;
          if (priceNum <= budgetNum * 0.8) score += 3;
        }
      }

      return { pkg, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top3 = scored.slice(0, 3).filter((s) => s.score > 0);

    const results = top3.map((s) => {
      const components = getPackageComponents(s.pkg.package_id);
      return { package: s.pkg, components, matchScore: s.score, reason: s.score >= 10 ? `Strong match for "${s.pkg.theme}" theme` : "Partial keyword match" };
    });

    let responseText = "";
    if (results.length === 0) {
      responseText = isHindi
        ? `"${interests}" के लिए कोई मजबूत मैच नहीं मिला। कृपया अपनी रुचियाँ व्यापक बनाएं।`
        : `I couldn't find a strong match for "${interests}". Try broadening your interests.`;
    } else {
      if (isHindi) {
        const hindiThemes: Record<string, string> = {
          adventure: "साहसिक", heritage: "विरासत", honeymoon: "हनीमून",
          family: "परिवार", pilgrimage: "तीर्थयात्रा", wellness: "कल्याण",
          wildlife: "वन्यजीव", food_trail: "खाद्य पथ",
        };
        responseText = `"${interests}" के आपके हितों के लिए${budget ? ` और ${budget} बजट में` : ""}:\n\n`;
        for (const r of results) {
          const themeHindi = hindiThemes[r.package.theme] || r.package.theme;
          responseText += `**${r.package.name}** (${themeHindi})\n${r.package.duration_days} दिन/${r.package.duration_nights} रात | ${r.package.tier} | ${r.package.base_price} ${r.package.currency}\n\n`;
        }
      } else {
        responseText = `Based on your interests in "${interests}"${budget ? ` with a budget of ${budget}` : ""}, I recommend:\n\n`;
        for (const r of results) {
          responseText += `**${r.package.name}** (${r.package.theme})\n${r.package.duration_days}D/${r.package.duration_nights}N | ${r.package.tier} | ${r.package.base_price} ${r.package.currency}\n\n`;
        }
      }
    }

    return Response.json({ response: responseText, recommendations: results });
  }
}
