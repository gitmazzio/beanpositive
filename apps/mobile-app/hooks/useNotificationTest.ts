import { useState } from "react";
import { Alert } from "react-native";
import { oneSignalService } from "../services/onesignal";

export interface UseNotificationTestReturn {
  isTesting: boolean;
  testNotification: () => Promise<void>;
  sendTestNotification: (
    title: string,
    message: string,
    data?: any
  ) => Promise<void>;
}

export const useNotificationTest = (): UseNotificationTestReturn => {
  const [isTesting, setIsTesting] = useState(false);

  const testNotification = async () => {
    try {
      setIsTesting(true);

      // Controlla se l'utente ha i permessi
      const hasPermission = await oneSignalService.areNotificationsEnabled();

      if (!hasPermission) {
        Alert.alert(
          "Notifiche non abilitate",
          "Abilita le notifiche nelle impostazioni per testare questa funzionalità."
        );
        return;
      }

      // Ottieni l'ID del dispositivo
      const deviceId = await oneSignalService.getDeviceId();

      Alert.alert(
        "Test notifiche",
        `Notifiche abilitate: ${hasPermission ? "Sì" : "No"}\nDevice ID: ${deviceId || "Non disponibile"}`,
        [
          { text: "OK" },
          {
            text: "Invia notifica di test",
            onPress: () =>
              sendTestNotification(
                "Test Bean Positive",
                "Questa è una notifica di test! 🎉",
                { type: "test", screen: "/(authenticated)/(tabs)" }
              ),
          },
        ]
      );
    } catch (error) {
      console.error("Error testing notifications:", error);
      Alert.alert("Errore", "Errore durante il test delle notifiche");
    } finally {
      setIsTesting(false);
    }
  };

  const sendTestNotification = async (
    title: string,
    message: string,
    data?: any
  ) => {
    try {
      setIsTesting(true);

      // Nota: Per inviare notifiche programmaticamente, dovresti usare l'API REST di OneSignal
      // Questo è solo un esempio di come potresti implementarlo
      Alert.alert(
        "Notifica di test",
        `Titolo: ${title}\nMessaggio: ${message}\nDati: ${JSON.stringify(data)}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error sending test notification:", error);
      Alert.alert("Errore", "Errore durante l'invio della notifica di test");
    } finally {
      setIsTesting(false);
    }
  };

  return {
    isTesting,
    testNotification,
    sendTestNotification,
  };
};

