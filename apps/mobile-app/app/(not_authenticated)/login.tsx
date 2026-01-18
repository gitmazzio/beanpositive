import { Button } from "@/components/commons/Button"
import Flex from "@/components/commons/Flex"
import HorizontalLine from "@/components/commons/HorizontalLine"
import Link from "@/components/commons/Link"
import StyledText from "@/components/commons/StyledText"
import { PageView } from "@/components/Themed"
import { useNotificationPermissionFlow } from "@/hooks/useNotificationPermissionFlow"
import { useAuth } from "@/providers"
import { triggerErrorHaptic } from "@/utils/haptics"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, Image, Platform, StyleSheet } from "react-native"
import Toast from "react-native-toast-message"

export default function Login() {
  const [error, setError] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const router = useRouter()
  const { user, loginWithGoogle, loginWithApple } = useAuth()
  const { checkAndNavigateAfterLogin } = useNotificationPermissionFlow()

  const handleGoogleLogin = async () => {
    // Prevenire login simultanei
    if (isAuthenticating || isGoogleLoading || isAppleLoading) return

    // Se l'utente è già loggato, naviga direttamente
    if (user) {
      await checkAndNavigateAfterLogin()
      return
    }

    setError("")
    setIsGoogleLoading(true)
    setIsAuthenticating(true)
    try {
      await loginWithGoogle()
      // Controlla i permessi delle notifiche e naviga di conseguenza
      await checkAndNavigateAfterLogin()
    } catch (err: any) {
      void triggerErrorHaptic();
      Toast.show({
        type: "error",
        text1: err.message || "Login con Google fallito",
        position: "top",
        visibilityTime: 2000,
      });
      const errorMessage = err.message || "Login con Google fallito"
      // setError(errorMessage)
      // Non mostrare alert per cancellazione utente
      if (!errorMessage.includes("cancelled")) {
        Alert.alert("Errore", errorMessage)
      }
    } finally {
      setIsGoogleLoading(false)
      setIsAuthenticating(false)
    }
  }

  const handleAppleLogin = async () => {
    // Prevenire login simultanei
    if (isAuthenticating || isGoogleLoading || isAppleLoading) return

    // Se l'utente è già loggato, naviga direttamente
    if (user) {
      await checkAndNavigateAfterLogin()
      return
    }

    setError("")
    setIsAppleLoading(true)
    setIsAuthenticating(true)
    try {
      await loginWithApple()
      // Controlla i permessi delle notifiche e naviga di conseguenza
      await checkAndNavigateAfterLogin()
    } catch (err: any) {
      const errorMessage = err.message || "Login con Apple fallito"
      // setError(errorMessage)
      // Non mostrare alert per cancellazione utente
      if (!errorMessage.includes("cancelled")) {
        Alert.alert("Errore", errorMessage)
      }
    } finally {
      setIsAppleLoading(false)
      setIsAuthenticating(false)
    }
  }

  const handleLogin = async () => {
    setError("")
    try {
      router.push("/(not_authenticated)/register")
    } catch (err: any) {
      setError(err.message || "Login failed")
    }
  }

  return (
    <PageView style={{ gap: 20, paddingTop: 100 }}>
      <Image
        source={require("./../../assets/images/login_bean.png")}
        style={{ width: 125, height: 125, alignSelf: "center" }}
      />
      <StyledText kind="h1" textAlign="center">
        Accedi o crea un account
      </StyledText>
      <StyledText kind="body" textAlign="center">
        {`Con un account personale potrai tenere traccia\ne conservare tutti i tuoi momenti`}
      </StyledText>
      <Button
        kind="tertiary"
        prefixIcon={<FontAwesome6 name="google" size={20} color={"#686260"} />}
        title="Continua con Google"
        onPress={handleGoogleLogin}
        disabled={isGoogleLoading}
      />
      {Platform.OS === "ios" ? (
        <Button
          kind="tertiary"
          prefixIcon={<FontAwesome6 name="apple" size={20} color={"#686260"} />}
          title="Continua con Apple"
          onPress={handleAppleLogin}
          disabled={isAppleLoading}
        />
      ) : null}
      {error && (
        <StyledText kind="body" style={{ color: "red", textAlign: "center" }}>
          {error}
        </StyledText>
      )}

      <HorizontalLine color="#E0E0E0" thickness={1} marginVertical={0} />
      <Button
        kind="primary"
        title="Crea con la tua mail"
        onPress={handleLogin}
      />
      <Flex gap={4} align="center">
        <StyledText kind="body">Hai già un account?</StyledText>
        <Link to={"/(not_authenticated)/signin"}>Accedi subito</Link>
      </Flex>

      {/* 
         // TODO mettere feature flag test
        */}
      {/* <Button
        title="test onboarding"
        onPress={async () => {
          await AsyncStorage.removeItem("onboardingSeen");
        }}
      /> */}
    </PageView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
})
