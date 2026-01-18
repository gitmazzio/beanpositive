import usePocketContext from "@/app/hooks/usePocketContext";
import { useLocation } from "@/hooks/useLocation";
import { useAuth } from "@/providers";
import { uploadHitImage } from "@/services/hitService";
import { triggerConfirmHaptic, triggerErrorHaptic } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { RequestCameraPermissionPrompt } from "./commons/RequestCameraPermissionPrompt";

interface CameraScreenProps {
  visible: boolean;
  onClose: () => void;
}

type CameraMode = "camera" | "preview";

/**
 * CameraScreen - Componente fullscreen per scattare foto selfie con countdown
 * 
 * Flusso:
 * 1. Apertura camera frontale con overlay "mettiti in posa"
 * 2. Countdown di 5 secondi
 * 3. Auto-scatto alla fine del countdown
 * 4. Preview con opzioni conferma/annulla
 * 5. Upload e creazione hit su conferma
 */
export const CameraScreen: React.FC<CameraScreenProps> = ({
  visible,
  onClose,
}) => {
  const { user } = useAuth();
  const { getCurrentLocation, getAddressFromCoordinates } = useLocation();
  const { onCameraSuccess } = usePocketContext();
  const queryClient = useQueryClient();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Stati del componente
  const [mode, setMode] = useState<CameraMode>("camera");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Reset stati quando il modal si chiude
  useEffect(() => {
    if (!visible) {
      setMode("camera");
      setCountdown(null);
      setCapturedImage(null);
      setIsUploading(false);
    }
  }, [visible]);


  // Countdown automatico quando si entra in modalità camera
  useEffect(() => {
    if (visible && mode === "camera" && permission?.granted && countdown === null) {
      // Inizia il countdown dopo un breve delay per permettere alla camera di inizializzarsi
      const timeout = setTimeout(() => {
        startCountdown();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [visible, mode, permission?.granted]);

  // Gestione countdown
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setTimeout(() => {
      if (countdown === 1) {
        // Fine countdown: scatta la foto
        handleTakePicture();
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  /**
   * Avvia il countdown di 5 secondi
   */
  const startCountdown = () => {
    setCountdown(5);
  };

  /**
   * Scatta automaticamente una foto alla fine del countdown
   */
  const handleTakePicture = async () => {
    if (!cameraRef.current || !permission?.granted) return;

    try {
      triggerConfirmHaptic();
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        setCapturedImage(photo.uri);
        setMode("preview");
        setCountdown(null);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      triggerErrorHaptic();
      Toast.show({
        type: "error",
        text1: "Errore",
        text2: "Impossibile scattare la foto",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  /**
   * Conferma la foto e procede con l'upload
   */
  const handleConfirm = async () => {
    if (!capturedImage || !user) return;

    setIsUploading(true);
    triggerConfirmHaptic();

    try {
      // Ottieni posizione se disponibile
      let address: string | undefined;
      let location: { lat: number; lng: number } | undefined;

      try {
        const currentLocation = await getCurrentLocation();
        if (currentLocation) {
          const { latitude, longitude } = currentLocation.coords;
          location = { lat: latitude, lng: longitude };

          const addressFromCoords = await getAddressFromCoordinates(
            latitude,
            longitude
          );
          address = addressFromCoords || "Posizione non disponibile";
        }
      } catch (locationError) {
        console.warn("Location error:", locationError);
        address = "Posizione non disponibile";
      }

      // Upload immagine e creazione hit
      await uploadHitImage(capturedImage, user.id, address, location);

      // Invalida le query per aggiornare la lista degli hit
      queryClient.invalidateQueries({ queryKey: ["hits"] });

      // Esegui le animazioni del pocket
      onCameraSuccess();

      Toast.show({
        type: "hintSuccess",
        text1: "Hai aggiunto un fagiolo. Grande!",
        position: "top",
        visibilityTime: 2000,
      });

      onClose();
    } catch (error: any) {
      console.error("Error uploading hit:", error);
      triggerErrorHaptic();
      Toast.show({
        type: "error",
        text1: "Errore",
        text2: error.message || "Impossibile salvare la foto",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Annulla la foto e torna alla camera
   */
  const handleCancel = () => {
    triggerConfirmHaptic();
    setCapturedImage(null);
    setMode("camera");
    setCountdown(null);
  };

  /**
   * Chiude il modal
   */
  const handleClose = () => {
    if (isUploading) return; // Previeni chiusura durante upload
    triggerConfirmHaptic();
    onClose();
  };

  // Mostra loading se i permessi non sono ancora stati richiesti
  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#D57E3A" />
        </View>
      </Modal>
    );
  }

  // Mostra richiesta permessi se non concessi
  if (permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
        <RequestCameraPermissionPrompt
          onPermissionGranted={() => { }}
          onPermissionDenied={() => { }}
          showOnlyIfNeeded={false}
          skip={() => { }}
          handleClose={handleClose}
        />
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        {mode === "camera" ? (
          <>
            {/* Camera View */}
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
              mode="picture"
            >
              {/* Overlay con countdown */}
              <View style={styles.overlay}>
                {/* Bottone X per chiudere */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={32} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Testo "mettiti in posa" */}
                <View style={styles.poseContainer}>
                  <Text style={styles.poseText}>Mettiti in posa</Text>
                  {countdown !== null && countdown > 0 && (
                    <View style={styles.countdownContainer}>
                      <Text style={styles.countdownText}>{countdown}</Text>
                    </View>
                  )}
                </View>
              </View>
            </CameraView>
          </>
        ) : (
          <>
            {/* Preview dell'immagine */}
            <Image source={{ uri: capturedImage! }} style={styles.preview} />

            {/* Overlay con bottoni conferma/annulla */}
            <View style={styles.previewOverlay}>
              {/* Bottone X per chiudere */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={32} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Bottoni conferma/annulla */}
              <View style={styles.previewActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelActionButton]}
                  onPress={handleCancel}
                  disabled={isUploading}
                >
                  <Ionicons name="close-circle" size={48} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.confirmActionButton]}
                  onPress={handleConfirm}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="checkmark-circle" size={48} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  poseContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  poseText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  countdownContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(213, 126, 58, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  countdownText: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
  },
  preview: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  previewOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  actionButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cancelActionButton: {
    backgroundColor: "rgba(220, 53, 69, 0.8)",
  },
  confirmActionButton: {
    backgroundColor: "rgba(40, 167, 69, 0.8)",
  },
  permissionText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  permissionButton: {
    backgroundColor: "#D57E3A",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
