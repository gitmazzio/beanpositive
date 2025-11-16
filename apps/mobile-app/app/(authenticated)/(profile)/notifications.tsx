import { Wrapper } from "@/components/authenticated/profile/Wrapper";
import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import HorizontalLine from "@/components/commons/HorizontalLine";
import StyledText from "@/components/commons/StyledText";
import { oneSignalService } from "@/services/onesignal";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Switch } from "react-native";

export default function NotificationsScreen() {
  const [morningEnabled, setMorningEnabled] = useState(false);
  const [eveningEnabled, setEveningEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const state = await oneSignalService.refreshDailyStateFromSystem();

      setMorningEnabled(state.daily_one);
      setEveningEnabled(state.daily_two);
    })();
  }, []);

  const handleSave = async () => {
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
    } finally {
      setSaving(false);
    }
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
              onValueChange={setMorningEnabled}
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
              onValueChange={setEveningEnabled}
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
        disabled={saving}
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
