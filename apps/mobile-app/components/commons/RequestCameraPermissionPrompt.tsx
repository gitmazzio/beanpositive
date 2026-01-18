import { useCameraPermissions } from "expo-camera";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button } from "./Button";
import StyledText from "./StyledText";

interface RequestCameraPermissionPromptProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  style?: any;
  showOnlyIfNeeded?: boolean;
  handleClose: () => void;
}

export const RequestCameraPermissionPrompt: React.FC<
  RequestCameraPermissionPromptProps
> = ({
  style,
  handleClose,
}) => {
    const [_, requestPermission] = useCameraPermissions();

    return (
      <View style={[styles.container, style]}>
        <Image
          source={require("../../assets/images/ask_geolocation.png")}
          style={styles.logo}
        />

        <StyledText kind="h1" textAlign="center" style={styles.title}>
          Attiva la fotocamera
        </StyledText>

        <StyledText kind="body" textAlign="center" style={styles.description}>
          Per poter aggiungere foto ai tuoi fagioli, abbiamo bisogno di
          accedere alla tua fotocamera.
        </StyledText>
        <View style={styles.buttonContainer}>
          <Button
            kind="primary"
            title={"Abilita la fotocamera"}
            onPress={requestPermission}
          />
          <Button
            kind="secondary"
            title={"Salta per ora"}
            onPress={handleClose}
          />
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF5E6",
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  secondaryButton: {
    marginTop: 4,
  },
  title: {
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
