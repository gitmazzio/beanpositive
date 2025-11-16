import React, { useState, useEffect } from "react";
import { View, StyleSheet, Switch, Alert } from "react-native";
import { Button } from "./Button";
import { useNotifications } from "../../hooks/useNotifications";
import StyledText from "./StyledText";

interface NotificationSettingsProps {
  style?: any;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  style,
}) => {
  const {
    hasPermission,
    isLoading,
    requestPermission,
    promptForNotifications,
  } = useNotifications();

  const [isEnabled, setIsEnabled] = useState(hasPermission === true);

  useEffect(() => {
    setIsEnabled(hasPermission === true);
  }, [hasPermission]);

  const handleToggle = async (value: boolean) => {
    if (value && hasPermission === false) {
      // Se l'utente vuole abilitare ma non ha i permessi, richiedili
      const granted = await requestPermission();
      if (granted) {
        setIsEnabled(true);
      } else {
        // Se l'utente rifiuta, mostra un prompt per aprire le impostazioni
        promptForNotifications();
      }
    } else if (!value) {
      // Se l'utente vuole disabilitare, mostra un alert per aprire le impostazioni
      Alert.alert(
        "Disabilita notifiche",
        "Per disabilitare le notifiche, vai nelle Impostazioni del dispositivo e disabilita le notifiche per Bean Positive.",
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Apri Impostazioni",
            onPress: () => {
              import("expo-linking").then(({ openSettings }) => {
                openSettings();
              });
            },
          },
        ]
      );
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setIsEnabled(true);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <StyledText kind="h3">Notifiche</StyledText>
        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          disabled={isLoading}
          trackColor={{ false: "#E0E0E0", true: "#7D8557" }}
          thumbColor={isEnabled ? "#FFFFFF" : "#FFFFFF"}
        />
      </View>

      <StyledText kind="body" style={styles.description}>
        Ricevi promemoria sui tuoi momenti positivi e aggiornamenti
        personalizzati.
      </StyledText>

      {hasPermission === false && (
        <Button
          kind="tertiary"
          title="Abilita notifiche"
          onPress={handleRequestPermission}
          disabled={isLoading}
          style={styles.button}
        />
      )}

      {hasPermission === null && (
        <StyledText kind="body" style={styles.loadingText}>
          Controllo permessi...
        </StyledText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  description: {
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
  loadingText: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
  },
});
