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
import { useEffect, useRef, useState } from "react"
import { Alert, Image, StyleSheet } from "react-native"
import Toast from "react-native-toast-message"

export default function Login() {
  const [error, setError] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const router = useRouter()
  const { user, loginWithGoogle, loginWithApple, loading } = useAuth()
  const { checkAndNavigateAfterLogin } = useNotificationPermissionFlow()
  const [pendingLoginCheck, setPendingLoginCheck] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Gestisce la navigazione dopo il login: aspetta che l'utente sia disponibile
  useEffect(() => {
    if (!pendingLoginCheck) {
      // Pulisci il timeout se non c'è più un login in attesa
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    // Se l'utente è disponibile e non stiamo più caricando, procedi
    if (user && !loading) {
      setPendingLoginCheck(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      checkAndNavigateAfterLogin()
      return
    }

    // Timeout di sicurezza: se l'utente non diventa disponibile entro 5 secondi
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(async () => {
        console.warn("⚠️ Timeout: utente non disponibile dopo 5 secondi, forzo la navigazione")
        setPendingLoginCheck(false)
        timeoutRef.current = null

        if (user) {
          await checkAndNavigateAfterLogin()
        } else {
          const { router } = await import("expo-router")
          router.replace("/(authenticated)/(tabs)")
        }
      }, 5000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [pendingLoginCheck, user, loading, checkAndNavigateAfterLogin])

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
      // Imposta il flag per indicare che dobbiamo aspettare che l'utente sia disponibile
      // Il useEffect gestirà la chiamata a checkAndNavigateAfterLogin quando l'utente sarà disponibile
      setPendingLoginCheck(true)
    } catch (err: any) {
      setPendingLoginCheck(false)
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
      // Imposta il flag per indicare che dobbiamo aspettare che l'utente sia disponibile
      // Il useEffect gestirà la chiamata a checkAndNavigateAfterLogin quando l'utente sarà disponibile
      setPendingLoginCheck(true)
    } catch (err: any) {
      setPendingLoginCheck(false)
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
      {process.env.EXPO_OS === "ios" ? (
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
