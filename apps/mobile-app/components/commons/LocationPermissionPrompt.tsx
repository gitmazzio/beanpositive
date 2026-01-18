import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "./Button";
import StyledText from "./StyledText";
import { triggerErrorHaptic } from "@/utils/haptics";
import { useLocation } from "@/hooks/useLocation";

interface LocationPermissionPromptProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  style?: any;
  showOnlyIfNeeded?: boolean;
  skip?: () => void;
}

export const LocationPermissionPrompt: React.FC<
  LocationPermissionPromptProps
> = ({
  onPermissionGranted,
  onPermissionDenied,
  style,
  showOnlyIfNeeded = true,
  skip,
}) => {
  const { hasPermission, isLoading, requestPermission } = useLocation();

  const handleRequestPermission = async () => {
    try {
      const granted = await requestPermission();

      if (granted) {
        onPermissionGranted?.();
      } else {
        void triggerErrorHaptic();
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      void triggerErrorHaptic();
      onPermissionDenied?.();
    }
  };

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
          title={isLoading ? "Caricamento..." : "Abilita la geolocalizzazione"}
          onPress={handleRequestPermission}
          disabled={isLoading}
          style={styles.primaryButton}
        />

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
