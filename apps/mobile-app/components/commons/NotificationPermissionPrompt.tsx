import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button } from "./Button";
import { oneSignalService } from "../../services/onesignal";
import StyledText from "./StyledText";

interface NotificationPermissionPromptProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  style?: any;
  showOnlyIfNeeded?: boolean;
  skip?: () => void;
}

export const NotificationPermissionPrompt: React.FC<
  NotificationPermissionPromptProps
> = ({
  onPermissionGranted,
  onPermissionDenied,
  style,
  showOnlyIfNeeded = true,
  skip,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const permission = await oneSignalService.areNotificationsEnabled();
      setHasPermission(permission);
    } catch (error) {
      console.error("Error checking permission status:", error);
    }
  };

  const handleRequestPermission = async () => {
    try {
      setIsLoading(true);
      const granted = await oneSignalService.requestPermissions();

      if (granted) {
        setHasPermission(true);
        onPermissionGranted?.();
      } else {
        setHasPermission(false);
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      onPermissionDenied?.();
    } finally {
      setIsLoading(false);
    }
  };

  // const handleOpenSettings = () => {
  //   Alert.alert(
  //     "Abilita le notifiche",
  //     "Per ricevere le notifiche, vai nelle Impostazioni e abilita le notifiche per Bean Positive.",
  //     [
  //       { text: "Annulla", style: "cancel" },
  //       {
  //         text: "Apri Impostazioni",
  //         onPress: () => {
  //           // Apre le impostazioni del dispositivo
  //           import("expo-linking").then(({ openSettings }) => {
  //             openSettings();
  //           });
  //         },
  //       },
  //     ]
  //   );
  // };

  // Se showOnlyIfNeeded è true e l'utente ha già i permessi, non mostrare nulla
  if (showOnlyIfNeeded && hasPermission === true) {
    return null;
  }

  // Se showOnlyIfNeeded è true e stiamo ancora controllando i permessi, non mostrare nulla
  if (showOnlyIfNeeded && hasPermission === null) {
    return null;
  }

  return (
    <View style={[style]}>
      <View style={styles.buttonContainer}>
        <Button
          kind="primary"
          title={isLoading ? "Caricamento..." : "Abilita notifiche"}
          onPress={handleRequestPermission}
          disabled={isLoading}
          style={styles.primaryButton}
        />

        {/* {hasPermission === false && (
          <Button
            kind="tertiary"
            title="Apri Impostazioni"
            onPress={handleOpenSettings}
            style={styles.secondaryButton}
          />
        )} */}
        <Button
          kind="secondary"
          title={"Salta per ora"}
          onPress={() => skip?.()}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginTop: 4,
  },
});
