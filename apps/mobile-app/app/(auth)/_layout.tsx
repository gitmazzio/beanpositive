import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/providers";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
