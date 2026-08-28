import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { logout } from "../../lib/api";
import { disconnectSocket } from "../../lib/socket";

export default function ProfileScreen() {
  const [guide, setGuide] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    loadGuide();
  }, []);

  const loadGuide = async () => {
    const stored = await SecureStore.getItemAsync("guide");
    if (stored) {
      const g = JSON.parse(stored);
      setGuide(g);
      setIsAvailable(g.is_available === 1);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          disconnectSocket();
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // TODO: PATCH /api/auth to update availability
  };

  if (!guide) return null;

  const specLabel = (s: string) => {
    const map: Record<string, string> = {
      heritage: "Heritage & Culture",
      food: "Food & Culinary",
      trekking: "Adventure & Trekking",
      wildlife: "Wildlife & Nature",
      photography: "Photography",
      religious: "Religious & Spiritual",
      shopping: "Shopping & Markets",
      accessibility: "Accessibility Expert",
    };
    return map[s] || s;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {guide.display_name?.charAt(0) || "G"}
          </Text>
        </View>
        <Text style={styles.name}>{guide.display_name}</Text>
        <Text style={styles.email}>{guide.email}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Specialisation</Text>
          <Text style={styles.value}>{specLabel(guide.specialisation || "")}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Languages</Text>
          <Text style={styles.value}>{guide.languages || "N/A"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Day Rate</Text>
          <Text style={[styles.value, { color: "#F59E0B" }]}>
            {guide.currency || "INR"} {guide.day_rate}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>{guide.city_id || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Available for Bookings</Text>
          <Switch
            value={isAvailable}
            onValueChange={toggleAvailability}
            trackColor={{ false: "#475569", true: "#2563EB" }}
            thumbColor={isAvailable ? "#F8FAFC" : "#94A3B8"}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>PackagePro Guide v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  header: { alignItems: "center", padding: 24, paddingBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  name: { fontSize: 22, fontWeight: "bold", color: "#F8FAFC" },
  email: { fontSize: 14, color: "#94A3B8", marginTop: 2 },
  card: {
    backgroundColor: "#1E293B",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  divider: { height: 1, backgroundColor: "#334155" },
  label: { fontSize: 14, color: "#94A3B8" },
  value: { fontSize: 14, fontWeight: "600", color: "#F8FAFC" },
  logoutBtn: {
    backgroundColor: "#EF4444",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  version: {
    color: "#475569",
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
  },
});
