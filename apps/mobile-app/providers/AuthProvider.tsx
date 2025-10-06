import { supabase } from "@/services/supabase";
import { oneSignalService } from "@/services/onesignal";
import { type AuthUser } from "@supabase/supabase-js";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    data?: {
      firstName?: string;
    }
  ) => Promise<void>;
  setAuthIsLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inizializza OneSignal
    oneSignalService.initialize().catch(console.error);

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // Gestisce OneSignal quando l'utente si logga/logout
        if (session?.user) {
          // Utente loggato - imposta l'ID esterno e i tag
          await oneSignalService.setExternalUserId(session.user.id);
          await oneSignalService.setUserTags({
            email: session.user.email || "",
            created_at: session.user.created_at,
          });
        } else {
          // Utente disconnesso - rimuovi l'ID esterno
          await oneSignalService.removeExternalUserId();
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    // setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const logout = async () => {
    setLoading(true);

    // Rimuovi l'ID esterno da OneSignal
    await oneSignalService.removeExternalUserId();

    // Reset del flag per richiedere nuovamente i permessi notifiche
    try {
      await AsyncStorage.removeItem("notificationRequested");
    } catch (error) {
      console.error("Error removing notification request flag:", error);
    }

    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
  };

  const register = async (
    email: string,
    password: string,
    data?: {
      firstName?: string;
    }
  ) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: data || {}, // Add any custom fields here
      },
    });

    if (error) throw error;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      register,
      setAuthIsLoading: setLoading,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
