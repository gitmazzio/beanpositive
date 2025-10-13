import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";
import { OneSignal } from "react-native-onesignal";
import { router } from "expo-router";

// Configurazione OneSignal
OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);

const NOTIFICATION_TEXTS = [
  {
    id: "daily_one",
    texts: {
      title: "Oggi, fai caso ai bei momenti ✨",
      body: "Anche solo un attimo può diventare un fagiolo da custodire",
      sound: "default",
    },
  },
  {
    id: "daily_two",
    texts: {
      title: "Cos'è andato bene oggi? 🫘",
      body: "Prima di andare a dormire… pensa a quel momento che oggi ti ha fatto sorridere",
      sound: "default",
    },
  },
];

// Configurazione delle notifiche Expo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  type?: string;
  screen?: string;
  id?: string;
  [key: string]: any;
}

export class OneSignalService {
  private static instance: OneSignalService;
  private isInitialized = false;
  private scheduledNotificationIds: Record<string, string | null> = {
    daily_one: null,
    daily_two: null,
  };

  private constructor() {}

  public static getInstance(): OneSignalService {
    if (!OneSignalService.instance) {
      OneSignalService.instance = new OneSignalService();
    }
    return OneSignalService.instance;
  }

  /**
   * Inizializza OneSignal e richiede i permessi
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configura i listener per le notifiche
      this.setupNotificationListeners();

      this.isInitialized = true;
      console.log("OneSignal initialized successfully");
    } catch (error) {
      console.error("Error initializing OneSignal:", error);
      throw error;
    }
  }

  /**
   * Richiede i permessi per le notifiche
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === "ios") {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert(
            "Permessi notifiche",
            "Le notifiche sono necessarie per ricevere aggiornamenti importanti. Puoi abilitarle nelle impostazioni.",
            [
              { text: "Annulla", style: "cancel" },
              {
                text: "Apri Impostazioni",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return false;
        }
      }

      // Richiede i permessi OneSignal
      const permission = await OneSignal.Notifications.requestPermission(true);

      return permission;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  /**
   * Schedula una notifica locale giornaliera all'orario specificato (ora:minuti)
   * Restituisce l'id della notifica schedulata
   */
  public async scheduleDailyNotification(
    id: "daily_one" | "daily_two",
    hour: number,
    minute: number,
    data?: Notifications.NotificationContentInput["data"]
  ): Promise<string | null> {
    try {
      // Cancella l'eventuale notifica precedente con lo stesso id
      const existing = this.scheduledNotificationIds[id];
      if (existing) {
        try {
          await Notifications.cancelScheduledNotificationAsync(existing);
        } catch {}
      }

      const trigger: Notifications.DailyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: Platform.OS === "android" ? "default" : undefined,
        hour,
        minute,
      };

      const content = NOTIFICATION_TEXTS.find((item) => item.id === id);

      // Ensure we tag the content with our slot id so we can discover it later
      const contentWithId: Notifications.NotificationContentInput = {
        ...content?.texts,
        data: { ...(data as any), slot: id },
      };

      const identifier = await Notifications.scheduleNotificationAsync({
        content: contentWithId,
        trigger,
      });

      this.scheduledNotificationIds[id] = identifier;
      return identifier;
    } catch (error) {
      console.error("Error scheduling daily notification:", error);
      return null;
    }
  }

  /**
   * Cancella una specifica notifica giornaliera precedentemente schedulata
   */
  public async cancelDailyNotification(
    id: "daily_one" | "daily_two"
  ): Promise<void> {
    try {
      const identifier = this.scheduledNotificationIds[id];
      if (identifier) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
        this.scheduledNotificationIds[id] = null;
      }
      // Also best-effort cancel by inspecting scheduled notifications with data.slot
      const all = await Notifications.getAllScheduledNotificationsAsync();
      for (const n of all) {
        const slot = (n as any)?.content?.data?.slot;
        if (slot === id) {
          try {
            await Notifications.cancelScheduledNotificationAsync(
              (n as any).identifier
            );
          } catch {}
        }
      }
    } catch (error) {
      console.error("Error cancelling daily notification:", error);
    }
  }

  /**
   * Restituisce lo stato locale di attivazione delle due notifiche
   */
  public getDailyNotificationsState(): {
    daily_one: boolean;
    daily_two: boolean;
  } {
    return {
      daily_one: !!this.scheduledNotificationIds.daily_one,
      daily_two: !!this.scheduledNotificationIds.daily_two,
    };
  }

  /**
   * Interroga il sistema per capire quali notifiche giornaliere sono attive.
   * Aggiorna la cache interna e restituisce lo stato.
   */
  public async refreshDailyStateFromSystem(): Promise<{
    daily_one: boolean;
    daily_two: boolean;
  }> {
    try {
      const all = await Notifications.getAllScheduledNotificationsAsync();

      const found: Record<string, string | null> = {
        daily_one: null,
        daily_two: null,
      };
      for (const n of all) {
        const slot = (n as any)?.content?.data?.slot;
        if (slot === "daily_one" || slot === "daily_two") {
          found[slot] = (n as any).identifier;
        }
      }
      this.scheduledNotificationIds = {
        daily_one: found.daily_one,
        daily_two: found.daily_two,
      } as any;

      return {
        daily_one: !!found.daily_one,
        daily_two: !!found.daily_two,
      };
    } catch (error) {
      console.error("Error refreshing daily notifications state:", error);
      return this.getDailyNotificationsState();
    }
  }

  /**
   * Configura i listener per le notifiche
   */
  private setupNotificationListeners(): void {
    // Listener per quando l'app è aperta e riceve una notifica
    OneSignal.Notifications.addEventListener("click", (event) => {
      console.log("OneSignal: notification clicked:", event);
      this.handleNotificationClick(event.notification);
    });

    // Listener per quando l'app è in background e riceve una notifica
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event) => {
        console.log("OneSignal: notification received in foreground:", event);
        // Qui puoi decidere se mostrare o meno la notifica
        event.getNotification().display();
      }
    );
  }

  /**
   * Gestisce il click su una notifica
   */
  private handleNotificationClick(notification: any): void {
    try {
      const data: NotificationData = notification.additionalData || {};
      console.log("Notification data:", data);

      // Gestisce i deeplink basati sui dati della notifica
      this.handleDeepLink(data);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  }

  /**
   * Gestisce i deeplink basati sui dati della notifica
   */
  private handleDeepLink(data: NotificationData): void {
    try {
      if (data.type && data.screen) {
        switch (data.type) {
          case "navigate":
            // Naviga a una schermata specifica
            router.push(data.screen as any);
            break;

          case "profile":
            // Naviga al profilo utente
            router.push("/(authenticated)/(profile)");
            break;

          case "pocket":
            // Naviga a una pocket specifica
            if (data.id) {
              router.push(`/(authenticated)/(tabs)/pocket/${data.id}`);
            } else {
              router.push("/(authenticated)/(tabs)");
            }
            break;

          case "settings":
            // Naviga alle impostazioni
            router.push("/(authenticated)/(profile)/settings");
            break;

          default:
            // Naviga alla schermata principale
            router.push("/(authenticated)/(tabs)");
        }
      } else {
        // Se non ci sono dati specifici, naviga alla schermata principale
        router.push("/(authenticated)/(tabs)");
      }
    } catch (error) {
      console.error("Error handling deep link:", error);
      // Fallback alla schermata principale
      router.push("/(authenticated)/(tabs)");
    }
  }

  /**
   * Invia un tag personalizzato all'utente
   */
  public async setUserTag(key: string, value: string): Promise<void> {
    try {
      OneSignal.User.addTag(key, value);
      console.log(`Tag set: ${key} = ${value}`);
    } catch (error) {
      console.error("Error setting user tag:", error);
    }
  }

  /**
   * Invia più tag personalizzati all'utente
   */
  public async setUserTags(tags: Record<string, string>): Promise<void> {
    try {
      OneSignal.User.addTags(tags);
      console.log("Tags set:", tags);
    } catch (error) {
      console.error("Error setting user tags:", error);
    }
  }

  /**
   * Imposta l'ID esterno dell'utente (per collegare con Supabase)
   */
  public async setExternalUserId(userId: string): Promise<void> {
    try {
      OneSignal.login(userId);
      console.log("External user ID set:", userId);
    } catch (error) {
      console.error("Error setting external user ID:", error);
    }
  }

  /**
   * Rimuove l'ID esterno dell'utente
   */
  public async removeExternalUserId(): Promise<void> {
    try {
      OneSignal.logout();
      console.log("External user ID removed");
    } catch (error) {
      console.error("Error removing external user ID:", error);
    }
  }

  /**
   * Ottiene l'ID del dispositivo OneSignal
   */
  public async getDeviceId(): Promise<string | null> {
    try {
      const deviceState = await OneSignal.User.getOnesignalId();
      return deviceState;
    } catch (error) {
      console.error("Error getting device ID:", error);
      return null;
    }
  }

  /**
   * Controlla se le notifiche sono abilitate
   */
  public async areNotificationsEnabled(): Promise<boolean> {
    try {
      const permission = await OneSignal.Notifications.getPermissionAsync();
      return permission;
    } catch (error) {
      console.error("Error checking notification permission:", error);
      return false;
    }
  }

  /**
   * Mostra un prompt per abilitare le notifiche
   */
  public async promptForNotifications(): Promise<void> {
    try {
      const hasPermission = await this.areNotificationsEnabled();

      if (!hasPermission) {
        Alert.alert(
          "Abilita le notifiche",
          "Ricevi aggiornamenti sui tuoi momenti positivi e promemoria personalizzati.",
          [
            { text: "Non ora", style: "cancel" },
            {
              text: "Abilita",
              onPress: async () => {
                await this.requestPermissions();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error prompting for notifications:", error);
    }
  }
}

// Esporta un'istanza singleton
export const oneSignalService = OneSignalService.getInstance();
