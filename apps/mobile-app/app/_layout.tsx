import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated";
import CustomSplashScreen from "../components/CustomSplashScreen";
import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider, useAuth } from "@/providers";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "./(auth)/onboarding";
import { AppSafeAreaView } from "@/components/AppSafeAreaView";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
});

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
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    (async () => {
      const onboardingSeen = await AsyncStorage.getItem("onboardingSeen");
      setShowOnboarding(onboardingSeen !== "true");
    })();
  }, []);

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

  const handleOnboardingFinish = useCallback(async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    setShowOnboarding(false);
  }, []);

  // Don't render anything until fonts are loaded
  if (!loaded || !appReady || showOnboarding === null) {
    return null;
  }

  return (
    <AppSafeAreaView>
      <AuthProvider>
        {showSplash && <CustomSplashScreen onFinish={handleSplashFinish} />}
        {!showSplash && showOnboarding && (
          <OnboardingScreen onFinish={handleOnboardingFinish} />
        )}
        {!showSplash && !showOnboarding && <RootLayoutNav />}
        <StatusBar
          style={"dark"}
          networkActivityIndicatorVisible={false}
          hidden={showSplash}
          backgroundColor="#7D8557"
        />
      </AuthProvider>
    </AppSafeAreaView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log("LOG", user);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={user}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)/onboarding" />
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
