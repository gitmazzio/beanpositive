import { Wrapper } from "@/components/authenticated/profile/Wrapper";
import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import HorizontalLine from "@/components/commons/HorizontalLine";
import StyledText from "@/components/commons/StyledText";
import { oneSignalService } from "@/services/onesignal";
import { useHapticsPreference } from "@/hooks/useHapticsPreference";
import { triggerErrorHaptic, triggerSelectionHaptic } from "@/utils/haptics";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { StyleSheet, Switch, ScrollView, TouchableOpacity } from "react-native";

interface ScheduledNotification {
  identifier: string;
  title: string;
  body: string;
  scheduledDate: Date | null;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    morning: false,
    evening: false,
  });
  const [initialNotifications, setInitialNotifications] = useState({
    morning: false,
    evening: false,
  });
  const [saving, setSaving] = useState(false);
  const [showScheduledList, setShowScheduledList] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<{
    daily_one: ScheduledNotification[];
    daily_two: ScheduledNotification[];
    total: number;
  }>({
    daily_one: [],
    daily_two: [],
    total: 0,
  });
  const [loadingScheduled, setLoadingScheduled] = useState(false);
  const { isEnabled: hapticsEnabled, isLoading: hapticsLoading, setEnabled } =
    useHapticsPreference();

  useEffect(() => {
    (async () => {
      const state = await oneSignalService.refreshDailyStateFromSystem();

      const newState = {
        morning: state.daily_one,
        evening: state.daily_two,
      };
      setNotifications(newState);
      setInitialNotifications(newState);
    })();
  }, []);

  const loadScheduledNotifications = async () => {
    try {
      setLoadingScheduled(true);
      const notifications = await oneSignalService.getDailyScheduledNotifications();

      console.log('LOG notifications from loadScheduledNotifications', notifications);

      setScheduledNotifications(notifications);
    } catch (error) {
      console.error("Error loading scheduled notifications:", error);
      Toast.show({
        type: "error",
        text1: "Errore nel caricamento delle notifiche",
      });
    } finally {
      setLoadingScheduled(false);
    }
  };

  const handleToggleScheduledList = async () => {
    if (!showScheduledList) {
      await loadScheduledNotifications();
    }
    setShowScheduledList(!showScheduledList);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "Data non disponibile";
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Default times: 09:00 for morning, 21:00 for evening
      if (notifications.morning) {
        await oneSignalService.scheduleDailyNotification("daily_one", 8, 30);
      } else {
        await oneSignalService.cancelDailyNotification("daily_one");
      }

      if (notifications.evening) {
        await oneSignalService.scheduleDailyNotification("daily_two", 21, 0);
      } else {
        await oneSignalService.cancelDailyNotification("daily_two");
      }

      setInitialNotifications(notifications);

      // Aggiorna la lista delle notifiche schedulate se è visibile
      if (showScheduledList) {
        await loadScheduledNotifications();
      }

      Toast.show({
        type: "hintSuccess",
        text1: "Le modifiche sono state salvate!",
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error: any) {
      void triggerErrorHaptic();
      Toast.show({
        type: "error",
        text1: error?.message || "Errore nel salvataggio delle notifiche",
      });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    notifications.morning !== initialNotifications.morning ||
    notifications.evening !== initialNotifications.evening;

  const handleMorningToggle = (value: boolean) => {
    void triggerSelectionHaptic();
    setNotifications((prev) => ({ ...prev, morning: value }));
  };

  const handleEveningToggle = (value: boolean) => {
    void triggerSelectionHaptic();
    setNotifications((prev) => ({ ...prev, evening: value }));
  };

  const handleHapticsToggle = async (value: boolean) => {
    void triggerSelectionHaptic();
    await setEnabled(value);
  };

  console.log('LOG scheduledNotifications', scheduledNotifications.daily_one.length);

  return (
    <Wrapper gap={16}>
      <Header withBack onPressBack={() => router.back()} />
      <StyledText kind="h1">Notifiche</StyledText>
      <StyledText kind="body">
        Imposta manualmente le notifiche che vuoi ricevere ogni giorni dall'app.
      </StyledText>

      <Flex style={styles.container} direction="column">
        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="column"
            gap={8}
            style={{
              maxWidth: "85%",
            }}
          >
            <StyledText kind="headline">Inizio giornata</StyledText>
            <StyledText kind="body">
              Ti ricorderemo a inizio di giornata di fare caso a tutti i tuoi
              “bei momenti”.
            </StyledText>
          </Flex>
          <Flex style={styles.switchRow}>
            <Switch
              value={notifications.morning}
              onValueChange={handleMorningToggle}
              trackColor={{ false: "#E0E0E0", true: "#7D8557" }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </Flex>
        </Flex>
        <HorizontalLine />
        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="column"
            gap={8}
            style={{
              maxWidth: "85%",
            }}
          >
            <StyledText kind="headline">Fine giornata</StyledText>
            <StyledText kind="body">
              Ti ricorderemo a fine giornata di segnare i “bei momenti” che hai
              vissuto oggi.
            </StyledText>
          </Flex>

          <Flex style={styles.switchRow}>
            <Switch
              value={notifications.evening}
              onValueChange={handleEveningToggle}
              trackColor={{ false: "#E0E0E0", true: "#7D8557" }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex style={styles.container} direction="column">
        <Flex direction="row" justify="space-between" align="center">
          <Flex
            direction="column"
            gap={8}
            style={{
              maxWidth: "85%",
            }}
          >
            <StyledText kind="headline">Feedback aptico</StyledText>
            <StyledText kind="body">
              Attiva o disattiva le vibrazioni durante l’uso dell’app.
            </StyledText>
          </Flex>
          <Flex style={styles.switchRow}>
            <Switch
              value={hapticsEnabled ?? true}
              onValueChange={handleHapticsToggle}
              disabled={hapticsLoading}
              trackColor={{ false: "#E0E0E0", true: "#7D8557" }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </Flex>
        </Flex>
      </Flex>

      <Button
        kind="secondary"
        title={saving ? "Salvataggio..." : "Conferma modifiche"}
        onPress={handleSave}
        disabled={saving || !hasChanges}
      />

      <Flex style={styles.container} direction="column">
        <TouchableOpacity
          onPress={handleToggleScheduledList}
          activeOpacity={0.7}
        >
          <Flex direction="row" justify="space-between" align="center">
            <Flex direction="column" gap={4}>
              <StyledText kind="headline">Notifiche schedulate</StyledText>
              <StyledText kind="body" style={styles.subtitle}>
                {scheduledNotifications.total > 0
                  ? `${scheduledNotifications.total} notifiche programmate`
                  : "Nessuna notifica schedulata"}
              </StyledText>
            </Flex>
            <StyledText kind="body" style={styles.toggleText}>
              {showScheduledList ? "Nascondi" : "Mostra"}
            </StyledText>
          </Flex>
        </TouchableOpacity>

        {showScheduledList && (
          <Flex direction="column" gap={12} style={styles.listContainer}>
            {loadingScheduled ? (
              <StyledText kind="body" textAlign="center">
                Caricamento...
              </StyledText>
            ) : scheduledNotifications.total === 0 ? (
              <StyledText kind="body" textAlign="center">
                Nessuna notifica schedulata
              </StyledText>
            ) : (
              <ScrollView style={styles.scrollView}>
                {scheduledNotifications.daily_one.length > 0 && (
                  <Flex direction="column" gap={8}>
                    <StyledText kind="headline" style={styles.sectionTitle}>
                      Inizio giornata ({scheduledNotifications.daily_one.length})
                    </StyledText>
                    {scheduledNotifications.daily_one
                      .map((notification) => (
                        <Flex
                          key={notification.identifier}
                          style={styles.notificationItem}
                          direction="column"
                          gap={4}
                        >
                          <StyledText kind="body" style={styles.notificationTitle}>
                            {notification.title}
                          </StyledText>
                          <StyledText kind="caption" style={styles.notificationBody}>
                            {notification.body}
                          </StyledText>
                          <StyledText kind="caption" style={styles.notificationDate}>
                            {formatDate(notification.scheduledDate)}
                          </StyledText>
                        </Flex>
                      ))}
                    {scheduledNotifications.daily_one.length > 10 && (
                      <StyledText kind="caption" style={styles.moreText}>
                        ... e altre{" "}
                        {scheduledNotifications.daily_one.length - 10} notifiche
                      </StyledText>
                    )}
                  </Flex>
                )}

                {scheduledNotifications.daily_two.length > 0 && (
                  <Flex direction="column" gap={8} style={styles.section}>
                    <StyledText kind="headline" style={styles.sectionTitle}>
                      Fine giornata ({scheduledNotifications.daily_two.length})
                    </StyledText>
                    {scheduledNotifications.daily_two
                      .map((notification) => (
                        <Flex
                          key={notification.identifier}
                          style={styles.notificationItem}
                          direction="column"
                          gap={4}
                        >
                          <StyledText kind="body" style={styles.notificationTitle}>
                            {notification.title}
                          </StyledText>
                          <StyledText kind="caption" style={styles.notificationBody}>
                            {notification.body}
                          </StyledText>
                          <StyledText kind="caption" style={styles.notificationDate}>
                            {formatDate(notification.scheduledDate)}
                          </StyledText>
                        </Flex>
                      ))}
                    {scheduledNotifications.daily_two.length > 10 && (
                      <StyledText kind="caption" style={styles.moreText}>
                        ... e altre{" "}
                        {scheduledNotifications.daily_two.length - 10} notifiche
                      </StyledText>
                    )}
                  </Flex>
                )}
              </ScrollView>
            )}
          </Flex>
        )}
      </Flex>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  switchRow: {
    alignItems: "flex-end",
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
  },
  toggleText: {
    color: "#7D8557",
    fontWeight: "600",
  },
  listContainer: {
    marginTop: 16,
    maxHeight: 400,
  },
  scrollView: {
    maxHeight: 350,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  notificationItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  notificationTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  notificationBody: {
    color: "#666",
    fontSize: 12,
    lineHeight: 16,
  },
  notificationDate: {
    color: "#999",
    fontSize: 11,
    marginTop: 4,
  },
  moreText: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
});
