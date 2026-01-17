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
import { StyleSheet, Switch } from "react-native";

export default function NotificationsScreen() {
  const [morningEnabled, setMorningEnabled] = useState(false);
  const [eveningEnabled, setEveningEnabled] = useState(false);
  const [initialMorningEnabled, setInitialMorningEnabled] = useState(false);
  const [initialEveningEnabled, setInitialEveningEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isEnabled: hapticsEnabled, isLoading: hapticsLoading, setEnabled } =
    useHapticsPreference();

  useEffect(() => {
    (async () => {
      const state = await oneSignalService.refreshDailyStateFromSystem();

      setMorningEnabled(state.daily_one);
      setEveningEnabled(state.daily_two);
      setInitialMorningEnabled(state.daily_one);
      setInitialEveningEnabled(state.daily_two);
    })();
  }, []);

  const handleSave = async () => {
    const hasChanges =
      morningEnabled !== initialMorningEnabled ||
      eveningEnabled !== initialEveningEnabled;

    if (!hasChanges) {
      return;
    }

    try {
      setSaving(true);
      // Default times: 09:00 for morning, 21:00 for evening
      if (morningEnabled) {
        await oneSignalService.scheduleDailyNotification("daily_one", 8, 30);
      } else {
        await oneSignalService.cancelDailyNotification("daily_one");
      }

      if (eveningEnabled) {
        await oneSignalService.scheduleDailyNotification("daily_two", 21, 0);
      } else {
        await oneSignalService.cancelDailyNotification("daily_two");
      }

      setInitialMorningEnabled(morningEnabled);
      setInitialEveningEnabled(eveningEnabled);
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
    morningEnabled !== initialMorningEnabled ||
    eveningEnabled !== initialEveningEnabled;

  const handleMorningToggle = (value: boolean) => {
    void triggerSelectionHaptic();
    setMorningEnabled(value);
  };

  const handleEveningToggle = (value: boolean) => {
    void triggerSelectionHaptic();
    setEveningEnabled(value);
  };

  const handleHapticsToggle = async (value: boolean) => {
    void triggerSelectionHaptic();
    await setEnabled(value);
  };

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
              value={morningEnabled}
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
              value={eveningEnabled}
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
});
