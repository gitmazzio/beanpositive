import { AppSafeAreaView } from "@/components/AppSafeAreaView";
import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider, useAuth } from "@/providers";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import "react-native-reanimated";
import CustomSplashScreen from "../components/CustomSplashScreen";
import OnboardingScreen from "./onboarding";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    DynaPuff: require("../assets/fonts/DynaPuff.ttf"),
    FigtreeItalic: require("../assets/fonts/Figtree-Italic.ttf"),
    Figtree: require("../assets/fonts/Figtree-Regular.ttf"),
    ...FontAwesome6.font,
  });
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Handle app initialization
  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (loaded) {
          // Check if onboarding has been shown before
          await SplashScreen.hideAsync();
          setAppReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [loaded]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Don't render anything until fonts are loaded
  if (!loaded || !appReady) {
    return null;
  }

  return (
    <AppSafeAreaView>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {showSplash && <CustomSplashScreen onFinish={handleSplashFinish} />}
          {!showSplash && <RootLayoutNav />}
          <StatusBar
            style={"dark"}
            networkActivityIndicatorVisible={false}
            hidden={showSplash}
            backgroundColor="#7D8557"
          />
        </AuthProvider>
      </QueryClientProvider>
    </AppSafeAreaView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const onboardingSeen = await AsyncStorage.getItem("onboardingSeen");
      setShowOnboarding(onboardingSeen !== "true");
    })();
  }, []);

  if (loading || showOnboarding == null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!user}>
          {showOnboarding && <Stack.Screen name="onboarding" />}
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={user}>
          <Stack.Screen name="(tabs)" />
          {/* Profile screen as a modal */}
          <Stack.Screen
            name="profile"
            options={{
              presentation: "modal",
              title: "Profile", // Optional: modal header title
            }}
          />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
