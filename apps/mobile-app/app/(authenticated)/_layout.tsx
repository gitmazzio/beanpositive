import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/providers";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/utils/toastConfig";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "(tabs)/index",
};

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          animation: "ios_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="notification-request"
          options={{ headerShown: false }}
        />
        {/* Profile screen as a modal */}
        <Stack.Screen
          name="(profile)"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}
