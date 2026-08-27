import { NextRequest } from "next/server";
import { getGuides, getGuideAvailability } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get("language") || undefined;
  const specialisation = searchParams.get("specialisation") || undefined;
  const cityId = searchParams.get("cityId") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const guides = getGuides(language, specialisation, cityId);

  // Attach availability if date range provided
  const guidesWithAvailability = guides.map((guide) => {
    let availability = null;
    if (startDate && endDate) {
      availability = getGuideAvailability(guide.guide_id, startDate, endDate);
    }
    return { ...guide, availability };
  });

  return Response.json({ guides: guidesWithAvailability });
}
