import { oneSignalService } from "@/services/onesignal"
import { supabase } from "@/services/supabase"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { type AuthUser } from "@supabase/supabase-js"
import * as AppleAuthentication from "expo-apple-authentication"
import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Inizializza OneSignal
    oneSignalService.initialize().catch(console.error)

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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
    return () => {
      listener?.subscription.unsubscribe()
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

  const loginWithGoogle = async () => {
    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: "beanpositiveapp",
        path: "auth/callback",
      })

      // Crea la richiesta OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
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
          // Estrai i parametri dalla URL di callback
          const url = new URL(result.url)
          const code = url.searchParams.get("code")
          const errorParam = url.searchParams.get("error")

          if (errorParam) {
            throw new Error(`OAuth error: ${errorParam}`)
          }

          if (!code || code.trim() === "") {
            throw new Error("Invalid or empty authorization code")
          }

          // Scambia il codice con la sessione
          const { data: sessionData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) throw exchangeError

          // La sessione viene gestita automaticamente da onAuthStateChange
          if (!sessionData.session) {
            throw new Error("No session returned after code exchange")
          }
        } catch (urlError: any) {
          if (urlError instanceof TypeError) {
            throw new Error("Invalid callback URL received from OAuth provider")
          }
          throw urlError
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
    await Notifications.cancelAllScheduledNotificationsAsync()

    // Rimuovi l'ID esterno da OneSignal
    await oneSignalService.removeExternalUserId()

    // Reset del flag per richiedere nuovamente i permessi notifiche
    try {
      await AsyncStorage.removeItem("notificationRequested")
    } catch (error) {
      console.error("Error removing notification request flag:", error)
    }

    const { error } = await supabase.auth.signOut()
    setLoading(false)
    if (error) throw error
  }

  const register = async (
    email: string,
    password: string,
    data?: {
      firstName?: string
    }
  ) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: data || {}, // Add any custom fields here
      },
    })

    if (error) throw error
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
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
