import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import {
  createBooking,
  getBookingsByGuide,
  seedDemoGuides,
} from "@/lib/writable-db";

const JWT_SECRET = process.env.JWT_SECRET || "packagepro-hackathon-2026-secret";

function authenticateGuide(req: NextRequest): { guide_id: string } | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    return jwt.verify(token, JWT_SECRET) as { guide_id: string };
  } catch {
    return null;
  }
}

// GET /api/bookings — list bookings for authenticated guide
export async function GET(req: NextRequest) {
  seedDemoGuides();

  const user = authenticateGuide(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = getBookingsByGuide(user.guide_id);
  return NextResponse.json({ bookings });
}

// POST /api/bookings — create a new booking (from traveler web app)
export async function POST(req: NextRequest) {
  seedDemoGuides();

  const body = await req.json();
  const {
    package_id,
    guide_id,
    traveler_name,
    traveler_email,
    traveler_phone,
    package_name,
    city_name,
    start_date,
    end_date,
    group_size,
    total_price,
    currency,
    notes,
  } = body;

  if (!package_id || !guide_id || !traveler_name || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const bookingId = "bk-" + uuid().slice(0, 8);
  const qrCode = "QR-" + bookingId.toUpperCase();

  const booking = createBooking({
    booking_id: bookingId,
    package_id,
    guide_id,
    traveler_name,
    traveler_email,
    traveler_phone,
    package_name,
    city_name,
    start_date,
    end_date,
    group_size: group_size || 1,
    total_price,
    currency: currency || "INR",
    qr_code: qrCode,
    notes,
  });

  return NextResponse.json({ booking }, { status: 201 });
}
