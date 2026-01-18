import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import { LocationPermissionPrompt } from "@/components/commons/LocationPermissionPrompt";
import StyledText from "@/components/commons/StyledText";
import { PageView } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function LocationRequest() {
  const router = useRouter();

  const handlePermissionGranted = async () => {
    await AsyncStorage.setItem("locationRequested", "true");

    router.replace("/(authenticated)/(tabs)");
  };

  const handlePermissionDenied = async () => {
    await AsyncStorage.setItem("locationRequested", "true");

    router.replace("/(authenticated)/(tabs)");
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("locationRequested", "true");

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
          source={require("../../assets/images/ask_geolocation.png")}
          style={styles.logo}
        />

        <StyledText kind="h1" textAlign="center" style={styles.title}>
          Attiva la posizione
        </StyledText>

        <StyledText kind="body" textAlign="center" style={styles.description}>
          Per poter salvare i tuoi fagioli in modo corretto, abbiamo bisogno di
          accedere alla tua posizione.
        </StyledText>

        <LocationPermissionPrompt
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
  title: {
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
