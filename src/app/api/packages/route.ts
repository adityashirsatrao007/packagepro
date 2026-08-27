import { NextRequest } from "next/server";
import { getPackages } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get("language") || undefined;
  const theme = searchParams.get("theme") || undefined;

  const packages = getPackages(language, theme);

  return Response.json({ packages });
}
