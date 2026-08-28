import Database from "better-sqlite3";
import path from "path";
import { v4 as uuid } from "uuid";

interface GuideRow {
  guide_id: string;
  email: string;
  password_hash: string;
  display_name: string;
  phone: string | null;
  avatar_url: string | null;
  city_id: string | null;
  languages: string | null;
  specialisation: string | null;
  day_rate: string | null;
  currency: string;
  is_available: number;
  created_at: string;
}

interface SessionRow {
  token: string;
  guide_id: string;
  expires_at: string;
  created_at: string;
}

interface BookingRow {
  booking_id: string;
  package_id: string;
  guide_id: string;
  traveler_name: string;
  traveler_email: string | null;
  traveler_phone: string | null;
  package_name: string | null;
  city_name: string | null;
  start_date: string;
  end_date: string;
  group_size: number;
  total_price: string | null;
  currency: string;
  status: string;
  qr_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

let _db: Database.Database | null = null;

export function getWritableDb(): Database.Database {
  if (!_db) {
    const dbPath = path.join(process.cwd(), "data", "app.db");
    _db = new Database(dbPath);
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS guides (
      guide_id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      phone TEXT,
      avatar_url TEXT,
      city_id TEXT,
      languages TEXT,
      specialisation TEXT,
      day_rate TEXT,
      currency TEXT DEFAULT 'INR',
      is_available INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      booking_id TEXT PRIMARY KEY,
      package_id TEXT NOT NULL,
      guide_id TEXT NOT NULL,
      traveler_name TEXT NOT NULL,
      traveler_email TEXT,
      traveler_phone TEXT,
      package_name TEXT,
      city_name TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      group_size INTEGER DEFAULT 1,
      total_price TEXT,
      currency TEXT DEFAULT 'INR',
      status TEXT DEFAULT 'pending',
      qr_code TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS guide_sessions (
      token TEXT PRIMARY KEY,
      guide_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

// Guide auth helpers
export function findGuideByEmail(email: string) {
  const db = getWritableDb();
  return db.prepare("SELECT * FROM guides WHERE email = ?").get(email) as GuideRow | undefined;
}

export function createGuide(guide: {
  guide_id: string;
  email: string;
  password_hash: string;
  display_name: string;
  phone?: string;
  city_id?: string;
  languages?: string;
  specialisation?: string;
  day_rate?: string;
}) {
  const db = getWritableDb();
  db.prepare(`
    INSERT INTO guides (guide_id, email, password_hash, display_name, phone, city_id, languages, specialisation, day_rate)
    VALUES (@guide_id, @email, @password_hash, @display_name, @phone, @city_id, @languages, @specialisation, @day_rate)
  `).run(guide);
}

export function findGuideById(guideId: string) {
  const db = getWritableDb();
  return db.prepare("SELECT * FROM guides WHERE guide_id = ?").get(guideId) as GuideRow | undefined;
}

export function createSession(token: string, guideId: string, expiresAt: string) {
  const db = getWritableDb();
  db.prepare("INSERT INTO guide_sessions (token, guide_id, expires_at) VALUES (?, ?, ?)").run(token, guideId, expiresAt);
}

export function findSession(token: string) {
  const db = getWritableDb();
  return db.prepare("SELECT * FROM guide_sessions WHERE token = ? AND expires_at > datetime('now')").get(token) as SessionRow | undefined;
}

export function deleteSession(token: string) {
  const db = getWritableDb();
  db.prepare("DELETE FROM guide_sessions WHERE token = ?").run(token);
}

export function updateGuideAvailability(guideId: string, isAvailable: boolean) {
  const db = getWritableDb();
  db.prepare("UPDATE guides SET is_available = ? WHERE guide_id = ?").run(isAvailable ? 1 : 0, guideId);
}

// Booking helpers
export function createBooking(booking: {
  booking_id: string;
  package_id: string;
  guide_id: string;
  traveler_name: string;
  traveler_email?: string;
  traveler_phone?: string;
  package_name?: string;
  city_name?: string;
  start_date: string;
  end_date: string;
  group_size?: number;
  total_price?: string;
  currency?: string;
  qr_code?: string;
  notes?: string;
}) {
  const db = getWritableDb();
  db.prepare(`
    INSERT INTO bookings (booking_id, package_id, guide_id, traveler_name, traveler_email, traveler_phone, package_name, city_name, start_date, end_date, group_size, total_price, currency, qr_code, notes)
    VALUES (@booking_id, @package_id, @guide_id, @traveler_name, @traveler_email, @traveler_phone, @package_name, @city_name, @start_date, @end_date, @group_size, @total_price, @currency, @qr_code, @notes)
  `).run(booking);
  return booking;
}

export function getBookingsByGuide(guideId: string) {
  const db = getWritableDb();
  return db.prepare("SELECT * FROM bookings WHERE guide_id = ? ORDER BY created_at DESC").all(guideId) as BookingRow[];
}

export function getBookingById(bookingId: string) {
  const db = getWritableDb();
  return db.prepare("SELECT * FROM bookings WHERE booking_id = ?").get(bookingId) as BookingRow | undefined;
}

export function updateBookingStatus(bookingId: string, status: string) {
  const db = getWritableDb();
  db.prepare("UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE booking_id = ?").run(status, bookingId);
}

export function getBookingByQrCode(qrCode: string) {
  const db = getWritableDb();
  return db.prepare("SELECT * FROM bookings WHERE qr_code = ?").get(qrCode) as BookingRow | undefined;
}

export function seedDemoGuides() {
  const db = getWritableDb();
  const count = db.prepare("SELECT COUNT(*) as c FROM guides").get() as { c: number };
  if (count.c > 0) return;

  const bcryptHash = "$2b$10$demo"; // demo only — no real bcrypt needed
  const demoGuides = [
    {
      guide_id: "guide-001",
      email: "priya@example.com",
      password_hash: bcryptHash,
      display_name: "Priya Sharma",
      phone: "+91-98765-43210",
      city_id: "city-001",
      languages: "hi,en",
      specialisation: "heritage",
      day_rate: "2500",
    },
    {
      guide_id: "guide-002",
      email: "raj@example.com",
      password_hash: bcryptHash,
      display_name: "Rajesh Kumar",
      phone: "+91-98765-43211",
      city_id: "city-002",
      languages: "ta,en",
      specialisation: "food",
      day_rate: "2000",
    },
    {
      guide_id: "guide-003",
      email: "meera@example.com",
      password_hash: bcryptHash,
      display_name: "Meera Nair",
      phone: "+91-98765-43212",
      city_id: "city-003",
      languages: "ml,en,hi",
      specialisation: "wildlife",
      day_rate: "3000",
    },
  ];

  for (const g of demoGuides) {
    db.prepare(`
      INSERT OR IGNORE INTO guides (guide_id, email, password_hash, display_name, phone, city_id, languages, specialisation, day_rate)
      VALUES (@guide_id, @email, @password_hash, @display_name, @phone, @city_id, @languages, @specialisation, @day_rate)
    `).run(g);
  }

  // Seed demo bookings
  const demoBookings = [
    {
      booking_id: "bk-" + uuid().slice(0, 8),
      package_id: "pkg-001",
      guide_id: "guide-001",
      traveler_name: "Aditya Shirsatrao",
      traveler_email: "aditya@example.com",
      package_name: "Varanasi Heritage Trail",
      city_name: "Varanasi",
      start_date: "2026-09-25",
      end_date: "2026-09-28",
      group_size: 2,
      total_price: "45000",
      currency: "INR",
      status: "pending",
      qr_code: "QR-BK-" + uuid().slice(0, 8).toUpperCase(),
    },
    {
      booking_id: "bk-" + uuid().slice(0, 8),
      package_id: "pkg-015",
      guide_id: "guide-001",
      traveler_name: "Sneha Patel",
      traveler_email: "sneha@example.com",
      package_name: "Kerala Backwater Escape",
      city_name: "Alleppey",
      start_date: "2026-10-01",
      end_date: "2026-10-04",
      group_size: 4,
      total_price: "62000",
      currency: "INR",
      status: "confirmed",
      qr_code: "QR-BK-" + uuid().slice(0, 8).toUpperCase(),
    },
  ];

  for (const b of demoBookings) {
    db.prepare(`
      INSERT OR IGNORE INTO bookings (booking_id, package_id, guide_id, traveler_name, traveler_email, package_name, city_name, start_date, end_date, group_size, total_price, currency, status, qr_code)
      VALUES (@booking_id, @package_id, @guide_id, @traveler_name, @traveler_email, @package_name, @city_name, @start_date, @end_date, @group_size, @total_price, @currency, @status, @qr_code)
    `).run(b);
  }
}
