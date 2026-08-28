import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {
  getBookingByQrCode,
  updateBookingStatus,
} from "@/lib/writable-db";

const JWT_SECRET = process.env.JWT_SECRET || "packagepro-hackathon-2026-secret";

function authenticateGuide(req: NextRequest): { guide_id: string } | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET) as { guide_id: string };
  } catch {
    return null;
  }
}

// POST /api/bookings/scan — scan QR code and verify booking
export async function POST(req: NextRequest) {
  const user = authenticateGuide(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { qr_code } = body;

  if (!qr_code) {
    return NextResponse.json({ error: "QR code required" }, { status: 400 });
  }

  const booking = getBookingByQrCode(qr_code);
  if (!booking) {
    return NextResponse.json({ error: "Invalid QR code — booking not found" }, { status: 404 });
  }

  if (booking.guide_id !== user.guide_id) {
    return NextResponse.json({ error: "This booking is not assigned to you" }, { status: 403 });
  }

  if (booking.status === "completed") {
    return NextResponse.json({ error: "Booking already checked in" }, { status: 409 });
  }

  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "Booking is cancelled" }, { status: 410 });
  }

  // Auto-confirm and mark in_progress
  updateBookingStatus(booking.booking_id, "in_progress");
  const updated = getBookingByQrCode(qr_code);

  return NextResponse.json({
    booking: updated,
    message: "Check-in successful!",
  });
}
