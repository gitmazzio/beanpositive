import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

export interface UseLocationReturn {
  hasPermission: boolean | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location.LocationObject | null>;
  getAddressFromCoordinates: (
    latitude: number,
    longitude: number
  ) => Promise<string | null>;
  promptForLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === "granted");
    } catch (error) {
      console.error("Error checking location permission status:", error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Controlla prima se abbiamo già i permessi
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === "granted") {
        setHasPermission(true);
        return true;
      }

      // Richiedi i permessi
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);
      
      if (!granted && process.env.EXPO_OS === "ios") {
        Alert.alert(
          "Permessi posizione",
          "La posizione è necessaria per salvare correttamente i tuoi fagioli. Puoi abilitarla nelle impostazioni.",
          [
            { text: "Annulla", style: "cancel" },
            {
              text: "Apri Impostazioni",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
      
      return granted;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== "granted") {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return location;
    } catch (error) {
      console.error("Error getting current location:", error);
      return null;
    }
  };

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<string | null> => {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const parts: string[] = [];

        if (address.street) parts.push(address.street);
        if (address.streetNumber) parts.push(address.streetNumber);
        if (address.city) parts.push(address.city);

        return parts.length > 0 ? parts.join(", ") : null;
      }

      return null;
    } catch (error) {
      console.error("Error getting address from coordinates:", error);
      return null;
    }
  };

  const promptForLocation = async (): Promise<void> => {
    try {
      Alert.alert(
        "Abilita la posizione",
        "Per salvare i tuoi fagioli in modo corretto, vai nelle Impostazioni e abilita la posizione per Bean Positive.",
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Apri Impostazioni",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error prompting for location:", error);
    }
  };

  return {
    hasPermission,
    isLoading,
    requestPermission,
    getCurrentLocation,
    getAddressFromCoordinates,
    promptForLocation,
  };
};
