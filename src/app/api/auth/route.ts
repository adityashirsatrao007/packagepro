import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import {
  findGuideByEmail,
  createGuide,
  createSession,
  findSession,
  deleteSession,
  seedDemoGuides,
} from "@/lib/writable-db";

const JWT_SECRET = process.env.JWT_SECRET || "packagepro-hackathon-2026-secret";

// POST /api/auth — login or register
export async function POST(req: NextRequest) {
  seedDemoGuides();

  const body = await req.json();
  const { action, email, password, display_name, phone, city_id, languages, specialisation, day_rate } = body;

  if (action === "login") {
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const guide = findGuideByEmail(email);
    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Demo: accept any password for seeded guides, or check bcrypt
    // For hackathon, simple comparison is fine
    if (password !== "demo123" && guide.password_hash !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ guide_id: guide.guide_id, email: guide.email }, JWT_SECRET, { expiresIn: "7d" });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    createSession(token, guide.guide_id, expiresAt);

    return NextResponse.json({
      token,
      guide: {
        guide_id: guide.guide_id,
        email: guide.email,
        display_name: guide.display_name,
        phone: guide.phone,
        city_id: guide.city_id,
        languages: guide.languages,
        specialisation: guide.specialisation,
        day_rate: guide.day_rate,
        is_available: guide.is_available,
      },
    });
  }

  if (action === "register") {
    if (!email || !password || !display_name) {
      return NextResponse.json({ error: "Email, password, and name required" }, { status: 400 });
    }

    const existing = findGuideByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const guideId = "guide-" + uuid().slice(0, 8);
    createGuide({
      guide_id: guideId,
      email,
      password_hash: password, // demo only
      display_name,
      phone,
      city_id,
      languages,
      specialisation,
      day_rate,
    });

    const token = jwt.sign({ guide_id: guideId, email }, JWT_SECRET, { expiresIn: "7d" });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    createSession(token, guideId, expiresAt);

    return NextResponse.json({
      token,
      guide: {
        guide_id: guideId,
        email,
        display_name,
        phone,
        city_id,
        languages,
        specialisation,
        day_rate,
        is_available: 1,
      },
    });
  }

  if (action === "logout") {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      deleteSession(authHeader.slice(7));
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "me") {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const session = findSession(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      const guide = findGuideByEmail(payload.email);
      if (!guide) {
        return NextResponse.json({ error: "Guide not found" }, { status: 404 });
      }
      return NextResponse.json({
        guide: {
          guide_id: guide.guide_id,
          email: guide.email,
          display_name: guide.display_name,
          phone: guide.phone,
          city_id: guide.city_id,
          languages: guide.languages,
          specialisation: guide.specialisation,
          day_rate: guide.day_rate,
          is_available: guide.is_available,
        },
      });
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
