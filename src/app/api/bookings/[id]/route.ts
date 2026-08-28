import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {
  getBookingById,
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

// PATCH /api/bookings/[id] — update booking status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticateGuide(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!status || !["pending", "confirmed", "in_progress", "completed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const booking = getBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.guide_id !== user.guide_id) {
    return NextResponse.json({ error: "Not your booking" }, { status: 403 });
  }

  updateBookingStatus(id, status);
  const updated = getBookingById(id);
  return NextResponse.json({ booking: updated });
}

// GET /api/bookings/[id] — get single booking
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticateGuide(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
