import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { oneSignalService } from "../services/onesignal";

export interface UseNotificationPermissionFlowReturn {
  isLoading: boolean;
  checkAndNavigateAfterLogin: () => Promise<void>;
  hasRequestedBefore: boolean | null;
}

export const useNotificationPermissionFlow =
  (): UseNotificationPermissionFlowReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasRequestedBefore, setHasRequestedBefore] = useState<
      boolean | null
    >(null);

    useEffect(() => {
      checkIfRequestedBefore();
    }, []);

    const checkIfRequestedBefore = async () => {
      try {
        const requested = await AsyncStorage.getItem("notificationRequested");
        setHasRequestedBefore(requested === "true");
      } catch (error) {
        console.error("Error checking notification request status:", error);
        setHasRequestedBefore(false);
      }
    };

    const checkAndNavigateAfterLogin = useCallback(async () => {
      try {
        setIsLoading(true);

        const requested = await AsyncStorage.getItem("notificationRequested");

        if (requested === "true") {
          const hasPermission = await oneSignalService.areNotificationsEnabled();

          if (hasPermission) {
            await oneSignalService.scheduleDailyNotificationIfNeeded();
          }
          await AsyncStorage.setItem("notificationRequested", "true");
          router.replace("/(authenticated)/(tabs)");
        } else {
          router.push("/(authenticated)/notification-request");
        }
      } catch (error) {
        console.error("Error in notification permission flow:", error);
        router.replace("/(authenticated)/(tabs)");
      } finally {
        setIsLoading(false);
      }
    }, []);

    return {
      isLoading,
      checkAndNavigateAfterLogin,
      hasRequestedBefore,
    };
  };
