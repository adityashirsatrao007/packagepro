import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { getBookings, updateBookingStatus } from "../../lib/api";
import { onNewBooking, onBookingStatus } from "../../lib/socket";
import { scheduleStatusNotification } from "../../lib/notifications";

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();

    const unsubNew = onNewBooking((data) => {
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
  }, []);

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

  const handleAccept = async (booking: any) => {
    Alert.alert(
      "Accept Booking",
      `Accept booking from ${booking.traveler_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            try {
              await updateBookingStatus(booking.booking_id, "confirmed");
              setBookings((prev) =>
                prev.map((b) =>
                  b.booking_id === booking.booking_id
                    ? { ...b, status: "confirmed" }
                    : b
                )
              );
              scheduleStatusNotification(
                `Booking from ${booking.traveler_name} confirmed!`
              );
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  const handleDecline = async (booking: any) => {
    Alert.alert(
      "Decline Booking",
      `Decline booking from ${booking.traveler_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
          style: "destructive",
          onPress: async () => {
            try {
              await updateBookingStatus(booking.booking_id, "cancelled");
              setBookings((prev) =>
                prev.map((b) =>
                  b.booking_id === booking.booking_id
                    ? { ...b, status: "cancelled" }
                    : b
                )
              );
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  const handleComplete = async (booking: any) => {
    try {
      await updateBookingStatus(booking.booking_id, "completed");
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === booking.booking_id
            ? { ...b, status: "completed" }
            : b
        )
      );
      scheduleStatusNotification(
        `Booking from ${booking.traveler_name} marked as completed!`
      );
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

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

  const filters = ["all", "pending", "confirmed", "in_progress", "completed"];
  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.travelerName}>{item.traveler_name}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: statusColor(item.status) + "20" },
          ]}
        >
          <Text style={[styles.badgeText, { color: statusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.packageName}>
        {item.package_name || item.package_id}
      </Text>
      <Text style={styles.detail}>
        📍 {item.city_name || "N/A"} · 👥 {item.group_size || 1} pax
      </Text>
      <Text style={styles.detail}>
        📅 {item.start_date} → {item.end_date}
      </Text>
      <Text style={styles.price}>
        {item.currency} {item.total_price}
      </Text>

      {item.status === "pending" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => handleAccept(item)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.declineBtn]}
            onPress={() => handleDecline(item)}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {(item.status === "confirmed" || item.status === "in_progress") && (
        <TouchableOpacity
          style={[styles.actionBtn, styles.completeBtn]}
          onPress={() => handleComplete(item)}
        >
          <Text style={styles.completeText}>Mark Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[styles.filterText, filter === f && styles.filterTextActive]}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.booking_id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={filtered.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#1E293B",
  },
  filterActive: { backgroundColor: "#2563EB" },
  filterText: { color: "#94A3B8", fontSize: 12, fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#1E293B",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  travelerName: { fontSize: 16, fontWeight: "bold", color: "#F8FAFC" },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: "bold" },
  packageName: { fontSize: 14, color: "#60A5FA", marginBottom: 4 },
  detail: { fontSize: 13, color: "#94A3B8", marginBottom: 2 },
  price: { fontSize: 16, fontWeight: "bold", color: "#F59E0B", marginTop: 8 },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  acceptBtn: { backgroundColor: "#10B981" },
  declineBtn: { backgroundColor: "#EF4444" },
  completeBtn: { backgroundColor: "#3B82F6", marginTop: 12 },
  acceptText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  declineText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  completeText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  emptyContainer: { flex: 1, justifyContent: "center" },
  emptyText: { color: "#64748B", textAlign: "center", padding: 40 },
});
