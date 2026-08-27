import Database from "better-sqlite3";
import path from "path";
import type { TourPackage, PackageComponent, TourGuide, GuideAvailability, City } from "@/types";

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    const dbPath = path.join(process.cwd(), "data", "PS-04.db");
    _db = new Database(dbPath, { readonly: true, fileMustExist: true });
  }
  return _db;
}

export function getPackages(language?: string, theme?: string): TourPackage[] {
  const db = getDb();
  let query = `
    SELECT tp.*, c.name as city_name
    FROM tour_packages tp
    LEFT JOIN cities c ON tp.city_id = c.city_id
    WHERE tp.status = 'active'
  `;
  const params: string[] = [];

  if (language) {
    const langBase = language.split("-")[0].toLowerCase();
    query += ` AND (tp.languages_offered LIKE ? OR tp.languages_offered LIKE ?)`;
    params.push(`%${langBase}%`, `%${language}%`);
  }
  if (theme) {
    query += ` AND tp.theme = ?`;
    params.push(theme);
  }

  query += ` ORDER BY CAST(tp.base_price AS REAL) DESC`;
  return db.prepare(query).all(...params) as TourPackage[];
}

export function getPackageById(id: string): TourPackage | undefined {
  const db = getDb();
  return db
    .prepare(
      `SELECT tp.*, c.name as city_name
       FROM tour_packages tp
       LEFT JOIN cities c ON tp.city_id = c.city_id
       WHERE tp.package_id = ?`
    )
    .get(id) as TourPackage | undefined;
}

export function getPackageComponents(packageId: string): PackageComponent[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM package_components
       WHERE package_id = ?
       ORDER BY day_index, slot`
    )
    .all(packageId) as PackageComponent[];
}

export function getSwapAlternatives(swapGroup: string, currentComponentId: string): PackageComponent[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM package_components
       WHERE swap_group = ? AND component_id != ?
       ORDER BY price_delta`
    )
    .all(swapGroup, currentComponentId) as PackageComponent[];
}

export function getGuides(
  language?: string,
  specialisation?: string,
  cityId?: string
): TourGuide[] {
  const db = getDb();
  let query = `
    SELECT g.*, c.name as city_name
    FROM tour_guides g
    LEFT JOIN cities c ON c.city_id = g.city_id
    WHERE g.status = 'active'
  `;
  const params: string[] = [];

  if (language) {
    const langLower = language.toLowerCase();
    const langMap: Record<string, string> = {
      hindi: "hi", english: "en", tamil: "ta", telugu: "te", bengali: "bn",
      marathi: "mr", gujarati: "gu", kannada: "kn", malayalam: "ml",
      odia: "or", punjabi: "pa", rajasthani: "hi", urdu: "ur",
      nepali: "ne", sindhi: "si", assamese: "as", manipuri: "mni",
      konkani: "kok", maithili: "mai", dogri: "doi",
    };
    const langCode = langMap[langLower] || langLower;
    query += ` AND (g.languages LIKE ? OR g.languages LIKE ?)`;
    params.push(`%${langCode}%`, `%${language}%`);
  }
  if (specialisation) {
    query += ` AND g.specialisation = ?`;
    params.push(specialisation);
  }
  if (cityId) {
    query += ` AND g.city_id = ?`;
    params.push(cityId);
  }

  query += ` ORDER BY g.rating DESC`;
  return db.prepare(query).all(...params) as TourGuide[];
}

export function getGuideAvailability(
  guideId: string,
  startDate: string,
  endDate: string
): GuideAvailability[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM guide_availability
       WHERE guide_id = ?
       AND for_date BETWEEN ? AND ?
       AND is_available = 1
       ORDER BY for_date`
    )
    .all(guideId, startDate, endDate) as GuideAvailability[];
}

export function getCity(cityId: string): City | undefined {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM cities WHERE city_id = ?`)
    .get(cityId) as City | undefined;
}

export function getGuide(guideId: string): TourGuide | undefined {
  const db = getDb();
  return db
    .prepare(
      `SELECT g.*, c.name as city_name
       FROM tour_guides g
       LEFT JOIN cities c ON c.city_id = g.city_id
       WHERE g.guide_id = ?`
    )
    .get(guideId) as TourGuide | undefined;
}

export function getLanguages() {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM languages ORDER BY english_name`)
    .all();
}
