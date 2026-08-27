export interface TourPackage {
  package_id: string;
  city_id: string;
  name: string;
  theme: string;
  tier: string;
  duration_days: number;
  duration_nights: number;
  base_price: string;
  currency: string;
  min_group_size: number;
  max_group_size: number;
  difficulty: string;
  languages_offered: string;
  inclusions: string;
  exclusions: string;
  description: string;
  status: string;
  updated_at: string;
  city_name?: string;
}

export interface PackageComponent {
  component_id: string;
  package_id: string;
  component_type: string;
  entity_type: string;
  entity_id: string;
  day_index: number;
  slot: string;
  title: string;
  quantity: number;
  price_delta: string;
  currency: string;
  is_optional: number;
  is_swappable: number;
  swap_group: string;
  updated_at: string;
}

export interface TourGuide {
  guide_id: string;
  city_id: string;
  display_name: string;
  languages: string;
  specialisation: string;
  secondary_specialisation: string;
  years_experience: number;
  rating: number;
  review_count: number;
  day_rate: string;
  half_day_rate: string;
  currency: string;
  certified: number;
  bio: string;
  status: string;
  updated_at: string;
  city_name?: string;
  availability?: GuideAvailability[];
}

export interface GuideAvailability {
  availability_id: string;
  guide_id: string;
  for_date: string;
  is_available: number;
  slots_available: number;
  price_multiplier: string;
  updated_at: string;
}

export interface Hotel {
  hotel_id: string;
  city_id: string;
  name: string;
  property_type: string;
  star_rating: number;
  guest_score: number;
  review_count: number;
  address_line: string;
  lat: number;
  lng: number;
  distance_to_centre_km: number;
  description: string;
  base_currency: string;
  checkin_time: string;
  checkout_time: string;
  chain_code: string;
  has_xr_scene: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  city_id: string;
  name: string;
  state: string;
  country_id: string;
  country_code: string;
  lat: number;
  lng: number;
  timezone: string;
  region: string;
  population: number;
  season_profile: string;
  peak_months: string;
  primary_language: string;
  description: string;
  status: string;
  updated_at: string;
}

export interface Transfer {
  transfer_id: string;
  city_id: string;
  from_label: string;
  to_label: string;
  mode: string;
  duration_minutes: number;
  distance_km: number;
  cost: string;
  currency: string;
  carbon_kg: number;
  capacity_pax: number;
  accessible: number;
  status: string;
  updated_at: string;
}

export interface UserPreference {
  preference_id: string;
  user_id: string;
  preferred_languages: string;
  guide_language: string;
  interests: string;
  dietary_flags: string;
  accessibility_needs: string;
  preferred_currency: string;
  max_daily_budget: string;
  max_daily_budget_currency: string;
  pace: string;
  updated_at: string;
}

export interface PriceBreakdown {
  label: string;
  amount: string;
  currency: string;
}

export interface RepriceResult {
  total: string;
  currency: string;
  breakdown: PriceBreakdown[];
}

export type PackageTheme =
  | "adventure"
  | "honeymoon"
  | "pilgrimage"
  | "family"
  | "heritage"
  | "wellness"
  | "wildlife"
  | "food_trail";

export type ComponentType =
  | "hotel"
  | "flight"
  | "poi"
  | "transfer"
  | "guide"
  | "meal"
  | "insurance"
  | "entry_ticket";

export type GuideSpecialisation =
  | "heritage"
  | "food"
  | "trekking"
  | "wildlife"
  | "photography"
  | "religious"
  | "shopping"
  | "accessibility";
