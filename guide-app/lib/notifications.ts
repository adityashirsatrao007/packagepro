import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function setupNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("bookings", {
      name: "Booking Notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2563EB",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === "granted";
}

export async function scheduleBookingNotification(booking: {
  traveler_name: string;
  package_name: string;
  city_name: string;
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New Booking Request!",
      body: `${booking.traveler_name} booked ${booking.package_name} in ${booking.city_name}`,
      data: { type: "new_booking" },
    },
    trigger: null, // immediate
  });
}

export async function scheduleStatusNotification(message: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Booking Updated",
      body: message,
      data: { type: "status_update" },
    },
    trigger: null,
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
