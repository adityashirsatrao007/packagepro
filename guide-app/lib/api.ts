import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3456";

async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync("auth_token");
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `API error ${res.status}`);
  }
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiFetch("/api/auth", {
    method: "POST",
    body: JSON.stringify({ action: "login", email, password }),
  });
  await SecureStore.setItemAsync("auth_token", data.token);
  await SecureStore.setItemAsync("guide", JSON.stringify(data.guide));
  return data;
}

export async function register(guide: {
  email: string;
  password: string;
  display_name: string;
  phone?: string;
  city_id?: string;
  languages?: string;
  specialisation?: string;
  day_rate?: string;
}) {
  const data = await apiFetch("/api/auth", {
    method: "POST",
    body: JSON.stringify({ action: "register", ...guide }),
  });
  await SecureStore.setItemAsync("auth_token", data.token);
  await SecureStore.setItemAsync("guide", JSON.stringify(data.guide));
  return data;
}

export async function logout() {
  try {
    await apiFetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "logout" }),
    });
  } catch {}
  await SecureStore.deleteItemAsync("auth_token");
  await SecureStore.deleteItemAsync("guide");
}

export async function getMe() {
  return apiFetch("/api/auth", {
    method: "POST",
    body: JSON.stringify({ action: "me" }),
  });
}

export async function getBookings() {
  return apiFetch("/api/bookings");
}

export async function updateBookingStatus(bookingId: string, status: string) {
  return apiFetch(`/api/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function scanQrCode(qrCode: string) {
  return apiFetch("/api/bookings/scan", {
    method: "POST",
    body: JSON.stringify({ qr_code: qrCode }),
  });
}

export async function createBooking(booking: {
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
}) {
  return apiFetch("/api/bookings", {
    method: "POST",
    body: JSON.stringify(booking),
  });
}
