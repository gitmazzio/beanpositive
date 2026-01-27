import * as Notifications from "expo-notifications"
import { Alert, Linking, Platform } from "react-native"
import { OneSignal } from "react-native-onesignal"
import { router } from "expo-router"

// Configurazione OneSignal
OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!)

const DAYS_TO_SCHEDULE = 30

// Messaggi per il mattino (daily_one)
const DAILY_ONE_MESSAGES: Array<{
  title: string
  body: string
  sound?: string
}> = [
    {
      title: "Oggi, fai caso ai bei momenti ✨",
      body: "Anche solo un attimo può diventare un fagiolo da custodire",
      sound: "default",
    },
    {
      title: "Buongiorno! 🌅",
      body: "Inizia la giornata con un sorriso e cerca i piccoli momenti di gioia",
      sound: "default",
    },
    {
      title: "Un nuovo giorno, nuove possibilità 🌱",
      body: "Cosa ti renderà felice oggi? Tieni gli occhi aperti per i bei momenti",
      sound: "default",
    },
    {
      title: "Inizia con positività ☀️",
      body: "Ogni giorno è un'opportunità per raccogliere fagioli positivi",
      sound: "default",
    },
    {
      title: "Buongiorno! 💫",
      body: "Oggi cerca almeno un momento che ti faccia sorridere",
      sound: "default",
    },
    {
      title: "Un nuovo inizio 🌸",
      body: "Quale bel momento vuoi custodire oggi?",
      sound: "default",
    },
    {
      title: "Buongiorno! 🌺",
      body: "Inizia la giornata con gratitudine per i piccoli piaceri",
      sound: "default",
    },
    {
      title: "Oggi è il giorno perfetto ✨",
      body: "Cerca i momenti che ti fanno sentire grato",
      sound: "default",
    },
    {
      title: "Buongiorno! 🦋",
      body: "Ogni giorno porta con sé qualcosa di bello da notare",
      sound: "default",
    },
    {
      title: "Inizia con un sorriso 😊",
      body: "Quale momento positivo vuoi ricordare oggi?",
      sound: "default",
    },
    {
      title: "Buongiorno! 🌈",
      body: "Cerca la bellezza nelle piccole cose di oggi",
      sound: "default",
    },
    {
      title: "Un nuovo giorno da vivere 🌟",
      body: "Tieni il cuore aperto ai momenti di gioia",
      sound: "default",
    },
    {
      title: "Buongiorno! 🍀",
      body: "Oggi, fai attenzione a ciò che ti rende felice",
      sound: "default",
    },
    {
      title: "Inizia con gratitudine 🙏",
      body: "Quale bel momento vuoi aggiungere alla tua tasca oggi?",
      sound: "default",
    },
    {
      title: "Buongiorno! 🌻",
      body: "Ogni giorno è una nuova opportunità per essere felici",
      sound: "default",
    },
  ]

// Messaggi per la sera (daily_two)
const DAILY_TWO_MESSAGES: Array<{
  title: string
  body: string
  sound?: string
}> = [
    {
      title: "Cos'è andato bene oggi? 🫘",
      body: "Prima di andare a dormire… pensa a quel momento che oggi ti ha fatto sorridere",
      sound: "default",
    },
    {
      title: "Rifletti sulla giornata 🌙",
      body: "Quale momento positivo vuoi ricordare prima di dormire?",
      sound: "default",
    },
    {
      title: "Buonanotte! ✨",
      body: "Pensa a qualcosa di bello che è successo oggi",
      sound: "default",
    },
    {
      title: "Raccogli i tuoi fagioli 🌙",
      body: "Quale bel momento vuoi custodire prima di dormire?",
      sound: "default",
    },
    {
      title: "Fine giornata 💫",
      body: "Ripensa a un momento che ti ha reso felice oggi",
      sound: "default",
    },
    {
      title: "Buonanotte! 🌟",
      body: "Prima di dormire, pensa a qualcosa per cui sei grato",
      sound: "default",
    },
    {
      title: "Rifletti con gratitudine 🙏",
      body: "Quale momento positivo vuoi portare con te nel sonno?",
      sound: "default",
    },
    {
      title: "Buonanotte! 🌸",
      body: "Pensa a un bel momento di oggi da custodire",
      sound: "default",
    },
    {
      title: "Fine giornata con positività ☀️",
      body: "Quale fagiolo positivo vuoi aggiungere alla tua tasca?",
      sound: "default",
    },
    {
      title: "Buonanotte! 🌺",
      body: "Ripensa a qualcosa di bello che è successo oggi",
      sound: "default",
    },
    {
      title: "Raccogli i momenti positivi 🌙",
      body: "Prima di dormire, pensa a un momento che ti ha fatto sorridere",
      sound: "default",
    },
    {
      title: "Buonanotte! 🦋",
      body: "Quale bel momento vuoi ricordare di questa giornata?",
      sound: "default",
    },
    {
      title: "Fine giornata con gratitudine 🌈",
      body: "Pensa a qualcosa per cui essere grato oggi",
      sound: "default",
    },
    {
      title: "Buonanotte! 🌟",
      body: "Ripensa a un momento positivo che vuoi custodire",
      sound: "default",
    },
    {
      title: "Rifletti sulla giornata 🍀",
      body: "Quale fagiolo positivo vuoi aggiungere prima di dormire?",
      sound: "default",
    },
  ]

/**
 * Seleziona un messaggio basato sulla data del giorno
 * Usa il giorno dell'anno come seed per garantire che lo stesso giorno
 * abbia sempre lo stesso messaggio, ma vari tra giorni diversi
 */
const getMessageForDate = (
  messages: Array<{ title: string; body: string; sound?: string }>,
  date: Date = new Date()
): { title: string; body: string; sound?: string } => {
  // Calcola il giorno dell'anno (1-365/366)
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Usa il giorno dell'anno come indice per selezionare il messaggio
  const index = dayOfYear % messages.length
  return messages[index]
}

// Configurazione delle notifiche Expo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export interface NotificationData {
  type?: string
  screen?: string
  id?: string
  [key: string]: any
}

export class OneSignalService {
  private static instance: OneSignalService
  private isInitialized = false
  private scheduledNotificationIds: Record<string, string | null> = {
    daily_one: null,
    daily_two: null,
  }

  private constructor() { }

  public static getInstance(): OneSignalService {
    if (!OneSignalService.instance) {
      OneSignalService.instance = new OneSignalService()
    }
    return OneSignalService.instance
  }

  /**
   * Inizializza OneSignal e richiede i permessi
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Configura i listener per le notifiche
      this.setupNotificationListeners()

      this.isInitialized = true
      console.log("OneSignal initialized successfully")
    } catch (error) {
      console.error("Error initializing OneSignal:", error)
      throw error
    }
  }

  /**
   * Richiede i permessi per le notifiche
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      // Richiede i permessi di Expo Notifications (necessari per lo scheduling)
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        if (Platform.OS === "ios") {
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
          )
        }
        console.warn("Expo Notifications permission not granted:", finalStatus)
        return false
      }

      // Richiede i permessi OneSignal
      const oneSignalPermission =
        await OneSignal.Notifications.requestPermission(true)

      if (!oneSignalPermission) {
        console.warn("OneSignal permission not granted")
        // Restituisce comunque true se Expo Notifications è stato concesso,
        // perché quello è necessario per lo scheduling locale
        return finalStatus === "granted"
      }

      return oneSignalPermission && finalStatus === "granted"
    } catch (error) {
      console.error("Error requesting notification permissions:", error)
      return false
    }
  }

  /**
   * Schedula notifiche giornaliere per i prossimi giorni con messaggi variati
   * Programma le notifiche per i prossimi 60 giorni con messaggi diversi ogni giorno
   * Restituisce l'id dell'ultima notifica schedulata
   */
  public async scheduleDailyNotification(
    id: "daily_one" | "daily_two",
    hour: number,
    minute: number,
    data?: Notifications.NotificationContentInput["data"]
  ): Promise<string | null> {
    try {
      // Verifica che i permessi siano stati concessi prima di schedulare
      const hasPermission = await this.areNotificationsEnabled()
      if (!hasPermission) {
        console.warn(
          `Cannot schedule notification ${id}: permissions not granted`
        )
        return null
      }

      // Verifica anche i permessi di Expo Notifications (usati per lo scheduling)
      const expoPermissions = await Notifications.getPermissionsAsync()
      if (expoPermissions.status !== "granted") {
        console.warn(
          `Cannot schedule notification ${id}: Expo notifications permission not granted`
        )
        return null
      }

      // Cancella tutte le notifiche precedenti con lo stesso slot
      await this.cancelDailyNotification(id)

      const messages =
        id === "daily_one" ? DAILY_ONE_MESSAGES : DAILY_TWO_MESSAGES
      const today = new Date()
      today.setHours(hour, minute, 0, 0)

      // Se l'orario di oggi è già passato, inizia da domani
      if (today.getTime() < Date.now()) {
        today.setDate(today.getDate() + 1)
      }

      // Programma le notifiche per i prossimi 60 giorni
      let lastIdentifier: string | null = null
      let scheduledCount = 0

      for (let day = 0; day < DAYS_TO_SCHEDULE; day++) {
        const notificationDate = new Date(today)
        // Aggiungi giorni usando millisecondi per garantire date consecutive corrette
        notificationDate.setTime(today.getTime() + day * 24 * 60 * 60 * 1000)

        // Seleziona il messaggio per questa data specifica
        const selectedMessage = getMessageForDate(messages, notificationDate)

        const trigger: Notifications.DateTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notificationDate,
        }

        const contentWithId: Notifications.NotificationContentInput = {
          ...selectedMessage,
          data: { ...(data as any), slot: id },
        }

        try {
          const identifier = await Notifications.scheduleNotificationAsync({
            content: contentWithId,
            trigger,
          })

          console.log("scheduled notification for day", day, "of", DAYS_TO_SCHEDULE, "with identifier", identifier)

          lastIdentifier = identifier
          scheduledCount++
        } catch (scheduleError) {
          console.error(
            `Error scheduling notification for day ${day} (${id}):`,
            scheduleError
          )
          // Continua con le altre notifiche anche se una fallisce
        }
      }

      console.log(
        `Scheduled ${scheduledCount}/${DAYS_TO_SCHEDULE} notifications for ${id}`
      )

      // Salva l'ultimo identifier per riferimento
      this.scheduledNotificationIds[id] = lastIdentifier
      return lastIdentifier
    } catch (error) {
      console.error("Error scheduling daily notification:", error)
      return null
    }
  }

  /**
   * Cancella una specifica notifica giornaliera precedentemente schedulata
   */
  public async cancelDailyNotification(
    id: "daily_one" | "daily_two"
  ): Promise<void> {
    try {
      const identifier = this.scheduledNotificationIds[id]
      if (identifier) {
        await Notifications.cancelScheduledNotificationAsync(identifier)
        this.scheduledNotificationIds[id] = null
      }
      // Also best-effort cancel by inspecting scheduled notifications with data.slot
      const all = await Notifications.getAllScheduledNotificationsAsync()
      for (const n of all) {
        const slot = (n as any)?.content?.data?.slot
        if (slot === id) {
          try {
            await Notifications.cancelScheduledNotificationAsync(
              (n as any).identifier
            )
          } catch { }
        }
      }
    } catch (error) {
      console.error("Error cancelling daily notification:", error)
    }
  }

  /**
   * Restituisce lo stato locale di attivazione delle due notifiche
   */
  public getDailyNotificationsState(): {
    daily_one: boolean
    daily_two: boolean
  } {
    return {
      daily_one: !!this.scheduledNotificationIds.daily_one,
      daily_two: !!this.scheduledNotificationIds.daily_two,
    }
  }

  /**
   * Interroga il sistema per capire quali notifiche giornaliere sono attive.
   * Aggiorna la cache interna e restituisce lo stato.
   */
  public async refreshDailyStateFromSystem(): Promise<{
    daily_one: boolean
    daily_two: boolean
  }> {
    try {
      const all = await Notifications.getAllScheduledNotificationsAsync()

      const found: Record<string, string | null> = {
        daily_one: null,
        daily_two: null,
      }
      for (const n of all) {
        const slot = (n as any)?.content?.data?.slot
        if (slot === "daily_one" || slot === "daily_two") {
          found[slot] = (n as any).identifier
        }
      }
      this.scheduledNotificationIds = {
        daily_one: found.daily_one,
        daily_two: found.daily_two,
      } as any

      return {
        daily_one: !!found.daily_one,
        daily_two: !!found.daily_two,
      }
    } catch (error) {
      console.error("Error refreshing daily notifications state:", error)
      return this.getDailyNotificationsState()
    }
  }

  public async scheduleDailyNotificationIfNeeded(): Promise<void> {
    const scheduledState = await this.getDailyScheduledNotifications();
    const refreshedState = await this.refreshDailyStateFromSystem();

    if (refreshedState.daily_one && scheduledState.daily_one.length <= 20) {
      await this.scheduleDailyNotification("daily_one", 8, 30);
    }

    if (refreshedState.daily_two && scheduledState.daily_two.length <= 20) {
      await this.scheduleDailyNotification("daily_two", 21, 0);
    }
  }

  /**
   * Ottiene tutte le notifiche schedulate con i dettagli
   */
  public async getAllScheduledNotifications(): Promise<
    Array<{
      identifier: string
      title: string
      body: string
      trigger: any
      slot?: string
      scheduledDate: Date | null
    }>
  > {
    try {
      const all = await Notifications.getAllScheduledNotificationsAsync()

      return all.map((notification: any) => {
        const slot = notification?.content?.data?.slot
        let scheduledDate: Date | null = null

        if (notification.trigger?.type === "date") {
          scheduledDate = new Date(notification.trigger.date)
        }

        return {
          identifier: notification.identifier,
          title: notification.content?.title || "Nessun titolo",
          body: notification.content?.body || "Nessun messaggio",
          trigger: notification.trigger,
          slot: slot || undefined,
          scheduledDate,
        }
      })
    } catch (error) {
      console.error("Error getting all scheduled notifications:", error)
      return []
    }
  }

  /**
   * Ottiene solo le notifiche giornaliere schedulate (daily_one e daily_two)
   */
  public async getDailyScheduledNotifications(): Promise<{
    daily_one: Array<{
      identifier: string
      title: string
      body: string
      scheduledDate: Date | null
    }>
    daily_two: Array<{
      identifier: string
      title: string
      body: string
      scheduledDate: Date | null
    }>
    total: number
  }> {
    try {
      const all = await this.getAllScheduledNotifications()

      const daily_one = all
        .filter((n) => n.slot === "daily_one")
        .map((n) => ({
          identifier: n.identifier,
          title: n.title,
          body: n.body,
          scheduledDate: n.scheduledDate,
        }))

      const daily_two = all
        .filter((n) => n.slot === "daily_two")
        .map((n) => ({
          identifier: n.identifier,
          title: n.title,
          body: n.body,
          scheduledDate: n.scheduledDate,
        }))

      return {
        daily_one,
        daily_two,
        total: daily_one.length + daily_two.length,
      }
    } catch (error) {
      console.error("Error getting daily scheduled notifications:", error)
      return {
        daily_one: [],
        daily_two: [],
        total: 0,
      }
    }
  }

  /**
   * Configura i listener per le notifiche
   */
  private setupNotificationListeners(): void {
    // Listener per quando l'app è aperta e riceve una notifica
    OneSignal.Notifications.addEventListener("click", (event) => {
      console.log("OneSignal: notification clicked:", event)
      this.handleNotificationClick(event.notification)
    })

    // Listener per quando l'app è in background e riceve una notifica
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event) => {
        console.log("OneSignal: notification received in foreground:", event)
        // Qui puoi decidere se mostrare o meno la notifica
        event.getNotification().display()
      }
    )
  }

  /**
   * Gestisce il click su una notifica
   */
  private handleNotificationClick(notification: any): void {
    try {
      const data: NotificationData = notification.additionalData || {}
      console.log("Notification data:", data)

      // Gestisce i deeplink basati sui dati della notifica
      this.handleDeepLink(data)
    } catch (error) {
      console.error("Error handling notification click:", error)
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
            router.push(data.screen as any)
            break

          case "profile":
            // Naviga al profilo utente
            router.push("/(authenticated)/(profile)")
            break

          case "pocket":
            // Naviga a una pocket specifica
            if (data.id) {
              router.push(`/(authenticated)/(tabs)/pocket/${data.id}`)
            } else {
              router.push("/(authenticated)/(tabs)")
            }
            break

          case "settings":
            // Naviga alle impostazioni
            router.push("/(authenticated)/(profile)/settings")
            break

          default:
            // Naviga alla schermata principale
            router.push("/(authenticated)/(tabs)")
        }
      } else {
        // Se non ci sono dati specifici, naviga alla schermata principale
        router.push("/(authenticated)/(tabs)")
      }
    } catch (error) {
      console.error("Error handling deep link:", error)
      // Fallback alla schermata principale
      router.push("/(authenticated)/(tabs)")
    }
  }

  /**
   * Invia un tag personalizzato all'utente
   */
  public async setUserTag(key: string, value: string): Promise<void> {
    try {
      OneSignal.User.addTag(key, value)
      console.log(`Tag set: ${key} = ${value}`)
    } catch (error) {
      console.error("Error setting user tag:", error)
    }
  }

  /**
   * Invia più tag personalizzati all'utente
   */
  public async setUserTags(tags: Record<string, string>): Promise<void> {
    try {
      OneSignal.User.addTags(tags)
      console.log("Tags set:", tags)
    } catch (error) {
      console.error("Error setting user tags:", error)
    }
  }

  /**
   * Imposta l'ID esterno dell'utente (per collegare con Supabase)
   */
  public async setExternalUserId(userId: string): Promise<void> {
    try {
      OneSignal.login(userId)
      console.log("External user ID set:", userId)
    } catch (error) {
      console.error("Error setting external user ID:", error)
    }
  }

  /**
   * Rimuove l'ID esterno dell'utente
   */
  public async removeExternalUserId(): Promise<void> {
    try {
      OneSignal.logout()
      console.log("External user ID removed")
    } catch (error) {
      console.error("Error removing external user ID:", error)
    }
  }

  /**
   * Ottiene l'ID del dispositivo OneSignal
   */
  public async getDeviceId(): Promise<string | null> {
    try {
      const deviceState = await OneSignal.User.getOnesignalId()
      return deviceState
    } catch (error) {
      console.error("Error getting device ID:", error)
      return null
    }
  }

  /**
   * Controlla se le notifiche sono abilitate
   * Verifica sia i permessi OneSignal che quelli di Expo Notifications
   */
  public async areNotificationsEnabled(): Promise<boolean> {
    try {
      // Verifica i permessi di Expo Notifications (necessari per lo scheduling)
      const expoPermissions = await Notifications.getPermissionsAsync()
      const expoGranted = expoPermissions.status === "granted"

      // Verifica i permessi OneSignal
      const oneSignalPermission =
        await OneSignal.Notifications.getPermissionAsync()

      // Entrambi i permessi devono essere concessi
      const bothGranted = expoGranted && oneSignalPermission

      if (!bothGranted) {
        console.log(
          `Notification permissions: Expo=${expoGranted}, OneSignal=${oneSignalPermission}`
        )
      }

      return bothGranted
    } catch (error) {
      console.error("Error checking notification permission:", error)
      return false
    }
  }

  /**
   * Mostra un prompt per abilitare le notifiche
   */
  public async promptForNotifications(): Promise<void> {
    try {
      const hasPermission = await this.areNotificationsEnabled()

      if (!hasPermission) {
        Alert.alert(
          "Abilita le notifiche",
          "Ricevi aggiornamenti sui tuoi momenti positivi e promemoria personalizzati.",
          [
            { text: "Non ora", style: "cancel" },
            {
              text: "Abilita",
              onPress: async () => {
                await this.requestPermissions()
              },
            },
          ]
        )
      }
    } catch (error) {
      console.error("Error prompting for notifications:", error)
    }
  }
}

// Esporta un'istanza singleton
export const oneSignalService = OneSignalService.getInstance()
