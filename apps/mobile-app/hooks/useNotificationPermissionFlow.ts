import { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { oneSignalService } from "../services/onesignal";

export interface UseNotificationPermissionFlowReturn {
  isLoading: boolean;
  checkAndNavigate: () => Promise<void>;
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

    const checkAndNavigate = async () => {
      try {
        setIsLoading(true);

        // Controlla se abbiamo già richiesto i permessi prima
        const requested = await AsyncStorage.getItem("notificationRequested");

        if (requested === "true") {
          // Abbiamo già richiesto i permessi, naviga direttamente alle tabs
          router.replace("/(authenticated)/(tabs)");
          return;
        }

        // Controlla se l'utente ha già i permessi
        const hasPermission = await oneSignalService.areNotificationsEnabled();

        console.log("LOG", { requested, hasPermission });

        if (hasPermission) {
          // L'utente ha già i permessi, salva che abbiamo controllato e naviga
          await AsyncStorage.setItem("notificationRequested", "true");
          router.replace("/(authenticated)/(tabs)");
        } else {
          // L'utente non ha i permessi, naviga alla pagina di richiesta
          return router.push("/(authenticated)/notification-request");
        }
      } catch (error) {
        console.error("Error in notification permission flow:", error);
        // In caso di errore, naviga comunque alle tabs
        router.replace("/(authenticated)/(tabs)");
      } finally {
        setIsLoading(false);
      }
    };

    return {
      isLoading,
      checkAndNavigate,
      hasRequestedBefore,
    };
  };
