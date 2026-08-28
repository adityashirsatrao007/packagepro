import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { setupNotifications } from "../lib/notifications";

export default function RootLayout() {
  useEffect(() => {
    setupNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification tapped:", response.notification.request.content.data);
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1E3A5F" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="scanner"
          options={{
            title: "Scan QR Code",
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}
