import { PageView } from "@/components/Themed";
import { useAuth } from "@/providers";
import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotAuthenticatedLayout() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <PageView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </PageView>
    );
  }

  return (
    <Stack
      screenOptions={{
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="recover-password" options={{ headerShown: false }} />
      <Stack.Screen
        name="email-verification"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
