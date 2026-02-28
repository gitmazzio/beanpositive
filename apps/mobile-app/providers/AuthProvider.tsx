import { oneSignalService } from "@/services/onesignal"
import { supabase } from "@/services/supabase"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { type AuthUser } from "@supabase/supabase-js"
import * as AppleAuthentication from "expo-apple-authentication"
import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import * as Notifications from "expo-notifications"
import { AppState, type AppStateStatus } from "react-native"
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

// Completa il flusso OAuth nel browser
WebBrowser.maybeCompleteAuthSession()

interface AuthContextProps {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithApple: () => Promise<void>
  logout: () => Promise<void>
  register: (
    email: string,
    password: string,
    data?: {
      firstName?: string
    }
  ) => Promise<void>
  setAuthIsLoading: (loading: boolean) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

const REFRESH_THRESHOLD_SECONDS = 300 // 5 minuti prima della scadenza
const REFRESH_CHECK_INTERVAL_MS = 4 * 60 * 1000 // 4 minuti

const isRefreshTokenExpired = (error: { message?: string } | null): boolean =>
  !!error?.message?.includes("refresh_token_not_found") ||
  !!error?.message?.includes("invalid_grant")

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const appState = useRef<AppStateStatus>(AppState.currentState)
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Inizializza OneSignal
    oneSignalService.initialize().catch(console.error)

    const stopRefreshMechanism = () => {
      supabase.auth.stopAutoRefresh()
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }

    const checkAndRefreshToken = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !sessionData.session) return

        const { expires_at: expiresAt } = sessionData.session
        const now = Math.floor(Date.now() / 1000)
        if (!expiresAt || expiresAt - now >= REFRESH_THRESHOLD_SECONDS) return

        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) {
          if (isRefreshTokenExpired(refreshError)) setUser(null)
          return
        }
        if (refreshData.session) {
          setUser(refreshData.session.user)
        }
      } catch (error) {
        console.error("❌ Error in token check:", error)
      }
    }

    const startRefreshMechanism = () => {
      supabase.auth.startAutoRefresh()
      if (!refreshIntervalRef.current) {
        refreshIntervalRef.current = setInterval(checkAndRefreshToken, REFRESH_CHECK_INTERVAL_MS)
      }
    }

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error || !data.session) {
        setUser(null)
        setLoading(false)
        return
      }

      const session = data.session
      const expiresAt = session.expires_at
      const now = Math.floor(Date.now() / 1000)
      const needsRefresh = expiresAt && expiresAt <= now + REFRESH_THRESHOLD_SECONDS

      if (needsRefresh) {
        try {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError) {
            if (isRefreshTokenExpired(refreshError)) setUser(null)
            else {
              setUser(session.user)
              startRefreshMechanism()
            }
            setLoading(false)
            return
          }
          if (refreshData?.session) {
            setUser(refreshData.session.user)
            startRefreshMechanism()
          }
        } catch {
          setUser(session.user)
          startRefreshMechanism()
        }
      } else {
        setUser(session.user)
        startRefreshMechanism()
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null)
          setLoading(false)
          stopRefreshMechanism()
          return
        }
        if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session) {
          startRefreshMechanism()
        }

        setUser(session?.user ?? null)
        setLoading(false)

        // Gestisce OneSignal quando l'utente si logga/logout
        if (session?.user) {
          // Utente loggato - imposta l'ID esterno e i tag
          try {
            await oneSignalService.setExternalUserId(session.user.id)
            await oneSignalService.setUserTags({
              email: session.user.email || "",
              created_at: session.user.created_at,
            })
          } catch (oneSignalError) {
            // Non bloccare il flusso se OneSignal fallisce
            console.error("OneSignal error (non-blocking):", oneSignalError)
          }
        } else {
          // Utente disconnesso - rimuovi l'ID esterno
          try {
            await oneSignalService.removeExternalUserId()
          } catch (oneSignalError) {
            // Non bloccare il flusso se OneSignal fallisce
            console.error("OneSignal error (non-blocking):", oneSignalError)
          }
        }
      }
    )

    if (process.env.EXPO_OS !== "web") {
      const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
            if (sessionError || !sessionData?.session) {
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
              if (refreshError) setUser(null)
              else if (refreshData?.session) {
                setUser(refreshData.session.user)
                startRefreshMechanism()
              }
              appState.current = nextAppState
              return
            }

            const { expires_at: expiresAt } = sessionData.session
            const now = Math.floor(Date.now() / 1000)
            const needsRefresh = expiresAt && expiresAt <= now + REFRESH_THRESHOLD_SECONDS

            if (needsRefresh) {
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
              if (refreshError && isRefreshTokenExpired(refreshError)) {
                setUser(null)
                appState.current = nextAppState
                return
              }
              if (refreshData?.session) setUser(refreshData.session.user)
            }
            startRefreshMechanism()
            await checkAndRefreshToken()
          } catch {
            setUser(null)
          }
        } else if (nextAppState.match(/inactive|background/)) {
          stopRefreshMechanism()
        }

        appState.current = nextAppState
      }

      const subscription = AppState.addEventListener("change", handleAppStateChange)

      return () => {
        listener?.subscription.unsubscribe()
        subscription.remove()
        stopRefreshMechanism()
      }
    }

    return () => {
      listener?.subscription.unsubscribe()
      stopRefreshMechanism()
    }
  }, [])

  const login = async (email: string, password: string) => {
    // setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  // Helper function per salvare il firstName dopo il login con Google
  const saveGoogleFirstName = async (user: AuthUser) => {
    try {
      // Controlla se il firstName è già presente nei metadata
      if (user.user_metadata?.firstName) {
        return // Già presente, non serve aggiornare
      }

      // Prova a recuperare il firstName dai metadata di Google
      const metadata = user.user_metadata || {}

      // Google può fornire il nome in diversi campi
      const fullName = metadata.full_name || metadata.name
      const givenName = metadata.given_name

      // Estrai il firstName dal fullName o usa il givenName
      let firstName = givenName

      if (!firstName && fullName) {
        // Se abbiamo solo il fullName, prendi la prima parola come firstName
        firstName = fullName.split(" ")[0]
      }

      // Salva il firstName se disponibile
      if (firstName && firstName.trim() !== "") {
        await supabase.auth.updateUser({
          data: {
            firstName: firstName.trim(),
          },
        })
        console.log("✅ firstName salvato per utente Google:", firstName)
      }
    } catch (updateError) {
      // Non bloccare il flusso se l'aggiornamento del nome fallisce
      console.error("Error updating Google user firstName (non-blocking):", updateError)
    }
  }

  const loginWithGoogle = async () => {
    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: "beanpositive",
        path: "auth/callback",
      })

      console.log("🔗 Redirect URL generato:", redirectTo)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) throw error
      if (!data.url) throw new Error("No OAuth URL returned")

      // Apri il browser per l'autenticazione
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)

      if (result.type === "success") {
        if (!result.url) {
          throw new Error("OAuth callback URL is missing")
        }

        try {
          console.log("🔗 Callback URL ricevuta:", result.url)

          let url: URL
          try {
            url = new URL(result.url)
          } catch (urlParseError) {
            throw new Error("Invalid callback URL received from OAuth provider")
          }

          const searchParams = url.searchParams
          const hashParams = new URLSearchParams((url.hash || "").substring(1))

          // Prova prima nei query parameters, poi nell'hash
          const code = searchParams.get("code") || hashParams.get("code")
          const errorParam = searchParams.get("error") || hashParams.get("error")
          const accessToken = searchParams.get("access_token") || hashParams.get("access_token")
          const refreshToken = searchParams.get("refresh_token") || hashParams.get("refresh_token")

          console.log("📋 Parametri estratti:", {
            hasCode: !!code,
            hasError: !!errorParam,
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasHash: !!url.hash,
          })

          if (errorParam) {
            throw new Error(`OAuth error: ${errorParam}`)
          }

          // PRIORITÀ 1: Flusso PKCE standard con codice
          if (code && code.trim() !== "") {
            console.log("✅ Trovato codice OAuth, uso flusso PKCE")

            // Scambia il codice con la sessione
            const { data: sessionData, error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error("❌ Errore nello scambio del codice:", exchangeError)
              // NON chiudere il browser se c'è un errore
              throw exchangeError
            }

            // La sessione viene gestita automaticamente da onAuthStateChange
            if (!sessionData.session) {
              console.error("❌ Nessuna sessione restituita dopo lo scambio del codice")
              // NON chiudere il browser se non c'è sessione
              throw new Error("No session returned after code exchange")
            }

            console.log("✅ Sessione creata con successo, aspetto che onAuthStateChange la processi...")

            // Aspetta un momento per permettere a onAuthStateChange di processare la sessione
            // e aggiornare lo stato dell'app
            await new Promise((resolve) => setTimeout(resolve, 300))

            // Verifica che la sessione sia ancora disponibile
            const { data: verifySession, error: verifyError } = await supabase.auth.getSession()
            if (verifyError) {
              console.error("❌ Errore nella verifica della sessione:", verifyError)
              throw verifyError
            }

            if (!verifySession.session) {
              console.error("❌ Sessione persa dopo lo scambio del codice")
              throw new Error("Session lost after code exchange")
            }

            // Salva il firstName se disponibile
            if (verifySession.session.user) {
              await saveGoogleFirstName(verifySession.session.user)
            }

            console.log("✅ Sessione verificata, chiudo il browser")

            // Chiudi la modale del browser SOLO dopo aver verificato che tutto è OK
            WebBrowser.maybeCompleteAuthSession()
            // Fallback: chiudi esplicitamente la modale se necessario
            try {
              await WebBrowser.dismissBrowser()
            } catch (dismissError) {
              // Ignora errori se la modale è già chiusa
              console.log("Browser already dismissed or not dismissible")
            }
            return
          }

          // PRIORITÀ 2: Se ci sono token nell'hash/URL, processali manualmente
          if (accessToken || refreshToken || url.hash.includes("access_token")) {
            console.log("⚠️ Token trovati nell'URL, processo manualmente la sessione")

            // Estrai tutti i parametri necessari dall'URL
            const extractedAccessToken = accessToken || hashParams.get("access_token")
            const extractedRefreshToken = refreshToken || hashParams.get("refresh_token")
            const expiresIn = searchParams.get("expires_in") || hashParams.get("expires_in")
            const tokenType = searchParams.get("token_type") || hashParams.get("token_type") || "bearer"

            console.log("📋 Token estratti:", {
              hasAccessToken: !!extractedAccessToken,
              hasRefreshToken: !!extractedRefreshToken,
              expiresIn,
              tokenType,
            })

            if (!extractedAccessToken || !extractedRefreshToken) {
              console.error("❌ Token mancanti nell'URL")
              throw new Error("Access token or refresh token missing in OAuth callback URL")
            }

            // Imposta la sessione manualmente usando i token estratti
            console.log("🔐 Imposto la sessione con i token estratti...")
            const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
              access_token: extractedAccessToken,
              refresh_token: extractedRefreshToken,
            })

            if (setSessionError) {
              console.error("❌ Errore nell'impostazione della sessione:", setSessionError)
              throw setSessionError
            }

            if (!sessionData.session) {
              console.error("❌ Nessuna sessione restituita dopo setSession")
              throw new Error("No session returned after setSession")
            }

            console.log("✅ Sessione impostata con successo, aspetto che onAuthStateChange la processi...")

            // Aspetta un momento per permettere a onAuthStateChange di processare la sessione
            await new Promise((resolve) => setTimeout(resolve, 300))

            // Verifica che la sessione sia ancora disponibile
            const { data: verifySession, error: verifyError } = await supabase.auth.getSession()
            if (verifyError) {
              console.error("❌ Errore nella verifica della sessione:", verifyError)
              throw verifyError
            }

            if (!verifySession.session) {
              console.error("❌ Sessione persa dopo setSession")
              throw new Error("Session lost after setSession")
            }

            // Salva il firstName se disponibile
            if (verifySession.session.user) {
              await saveGoogleFirstName(verifySession.session.user)
            }

            console.log("✅ Sessione verificata, chiudo il browser")

            // Chiudi la modale del browser SOLO dopo aver verificato che tutto è OK
            WebBrowser.maybeCompleteAuthSession()
            try {
              await WebBrowser.dismissBrowser()
            } catch (dismissError) {
              console.log("Browser already dismissed or not dismissible")
            }
            return
          }

          // Se non c'è né codice né token, c'è un problema
          throw new Error("Invalid OAuth callback: no code or token found in URL")
        } catch (urlError: unknown) {
          if (urlError instanceof Error) {
            throw urlError
          }
          throw new Error("Invalid callback URL received from OAuth provider")
        }
      } else if (result.type === "cancel") {
        throw new Error("Authentication cancelled by user")
      } else {
        throw new Error("Authentication failed")
      }
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    }
  }

  const loginWithApple = async () => {
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync()
      if (!isAvailable) {
        throw new Error("Apple Sign In is not available on this device")
      }

      // Richiedi le credenziali Apple
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (!credential.identityToken) {
        throw new Error("No identity token returned from Apple")
      }

      // Usa l'identity token per autenticarsi con Supabase
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      })

      if (error) throw error

      // La sessione viene gestita automaticamente da onAuthStateChange
      if (!data.session) {
        throw new Error("No session returned after Apple authentication")
      }

      // Salva il nome se disponibile (solo al primo login)
      if (credential.fullName) {
        const fullName = [
          credential.fullName.givenName,
          credential.fullName.familyName,
        ]
          .filter(Boolean)
          .join(" ")

        if (fullName) {
          try {
            await supabase.auth.updateUser({
              data: {
                full_name: fullName,
                given_name: credential.fullName.givenName || undefined,
                family_name: credential.fullName.familyName || undefined,
                firstName: credential.fullName.givenName || undefined,
              },
            })
          } catch (updateError) {
            // Non bloccare il flusso se l'aggiornamento del nome fallisce
            console.error("Error updating user name (non-blocking):", updateError)
          }
        }
      }
    } catch (error: any) {
      // Gestisci l'errore di cancellazione dell'utente
      if (
        error.code === "ERR_REQUEST_CANCELED" ||
        error.code === "ERR_CANCELED" ||
        error.message?.toLowerCase().includes("cancel")
      ) {
        throw new Error("Authentication cancelled by user")
      }
      console.error("Apple login error:", error)
      throw error
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await Notifications.cancelAllScheduledNotificationsAsync()
      await oneSignalService.removeExternalUserId()
      try {
        await AsyncStorage.removeItem("notificationRequested")
      } catch (storageError) {
        console.error("Error removing notification request flag:", storageError)
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    data?: {
      firstName?: string
    }
  ) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: data || {},
        },
      })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      loginWithGoogle,
      loginWithApple,
      logout,
      register,
      setAuthIsLoading: setLoading,
    }),
    [user, loading, login, loginWithGoogle, loginWithApple, logout, register]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.use(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
