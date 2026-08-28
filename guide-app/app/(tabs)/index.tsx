import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { getBookings } from "../../lib/api";
import {
  joinGuideRoom,
  onNewBooking,
  onBookingStatus,
} from "../../lib/socket";
import { scheduleBookingNotification } from "../../lib/notifications";

export default function DashboardScreen() {
  const [guide, setGuide] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGuide();
    loadBookings();
  }, []);

  useEffect(() => {
    if (!guide) return;
    joinGuideRoom(guide.guide_id);

    const unsubNew = onNewBooking((data) => {
      scheduleBookingNotification(data);
      setBookings((prev) => [data, ...prev]);
    });

    const unsubStatus = onBookingStatus((data) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === data.booking_id ? { ...b, status: data.status } : b
        )
      );
    });

    return () => {
      unsubNew();
      unsubStatus();
    };
  }, [guide]);

  const loadGuide = async () => {
    const stored = await SecureStore.getItemAsync("guide");
    if (stored) setGuide(JSON.parse(stored));
  };

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const pending = bookings.filter((b) => b.status === "pending");
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const inProgress = bookings.filter((b) => b.status === "in_progress");

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "#F59E0B";
      case "confirmed": return "#10B981";
      case "in_progress": return "#3B82F6";
      case "completed": return "#6B7280";
      case "cancelled": return "#EF4444";
      default: return "#94A3B8";
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Hello, {guide?.display_name || "Guide"} 👋
        </Text>
        <Text style={styles.greetingSub}>{guide?.city_id || "Your City"}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: "#F59E0B" }]}>
          <Text style={styles.statNumber}>{pending.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#10B981" }]}>
          <Text style={styles.statNumber}>{confirmed.length}</Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#3B82F6" }]}>
          <Text style={styles.statNumber}>{inProgress.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push("/scanner")}
      >
        <Text style={styles.scanButtonText}>📷 Scan QR Check-In</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        {bookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings yet</Text>
        ) : (
          bookings.slice(0, 5).map((booking) => (
            <View key={booking.booking_id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingName}>{booking.traveler_name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColor(booking.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusColor(booking.status) },
                    ]}
                  >
                    {booking.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.bookingDetail}>
                {booking.package_name || booking.package_id}
              </Text>
              <Text style={styles.bookingDetail}>
                {booking.city_name} · {booking.start_date} to {booking.end_date}
              </Text>
              <Text style={styles.bookingPrice}>
                {booking.currency} {booking.total_price}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  greeting: { padding: 20, paddingBottom: 12 },
  greetingText: { fontSize: 24, fontWeight: "bold", color: "#F8FAFC" },
  greetingSub: { fontSize: 14, color: "#94A3B8", marginTop: 2 },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
  },
  statNumber: { fontSize: 28, fontWeight: "bold", color: "#F8FAFC" },
  statLabel: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  scanButton: {
    backgroundColor: "#2563EB",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  scanButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  section: { paddingHorizontal: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 12,
  },
  emptyText: { color: "#64748B", textAlign: "center", padding: 20 },
  bookingCard: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  bookingName: { fontSize: 16, fontWeight: "bold", color: "#F8FAFC" },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  bookingDetail: { fontSize: 13, color: "#94A3B8", marginBottom: 2 },
  bookingPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#F59E0B",
    marginTop: 6,
  },
});
