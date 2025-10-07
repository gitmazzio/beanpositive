import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import StyledText from "@/components/commons/StyledText";
import { NotificationPermissionPrompt } from "@/components/commons/NotificationPermissionPrompt";
import { PageView } from "@/components/Themed";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { oneSignalService } from "@/services/onesignal";

export default function NotificationRequest() {
  const router = useRouter();

  const handlePermissionGranted = async () => {
    await oneSignalService.scheduleDailyNotification("daily_one", 8, 30);
    await oneSignalService.scheduleDailyNotification("daily_two", 21, 0);

    await AsyncStorage.setItem("notificationRequested", "true");

    router.replace("/(authenticated)/(tabs)");
  };

  const handlePermissionDenied = async () => {
    await AsyncStorage.setItem("notificationRequested", "true");

    router.replace("/(authenticated)/(tabs)");
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("notificationRequested", "true");

    // Naviga alle tabs
    router.replace("/(authenticated)/(tabs)");
  };

  return (
    <PageView>
      <Header
        withBack={false}
        // rightChildren={
        //   <Button
        //     kind="tertiary"
        //     title="Salta"
        //     onPress={handleSkip}
        //     disabled={isProcessing}
        //     style={styles.skipButton}
        //   />
        // }
      />

      <Flex
        direction="column"
        align="center"
        justify="center"
        style={styles.content}
      >
        <Image
          source={require("../../assets/images/ask_notifications.png")}
          style={styles.logo}
        />

        <StyledText kind="h1" textAlign="center" style={styles.title}>
          Attiva le notifiche
        </StyledText>

        <StyledText kind="body" textAlign="center" style={styles.description}>
          Se abiliti gli avvisi, possiamo ricordarti noi quando mettere da parte
          i tuoi fagioli durante la settimana
        </StyledText>

        <NotificationPermissionPrompt
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
          showOnlyIfNeeded={false}
          skip={handleSkip}
          style={styles.promptContainer}
        />
      </Flex>
    </PageView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  description: {
    marginTop: 16,
    marginBottom: 40,
    lineHeight: 22,
  },
  promptContainer: {
    width: "100%",
    maxWidth: 400,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
