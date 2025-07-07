import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User,
  sendEmailVerification,
} from "firebase/auth";

import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBd839nCzgXPQrAuV0nq_zIZirnQdmL1kw",
  authDomain: "beanpositive-app.firebaseapp.com",
  projectId: "beanpositive-app",
  storageBucket: "beanpositive-app.firebasestorage.app",
  messagingSenderId: "532957611936",
  appId: "1:532957611936:web:096ea8d75997ea9116c6c5",
  measurementId: "G-G01VXCX0Q3",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
import { getReactNativePersistence } from "@/utils/getReactNativePersistence";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log("LOG loading", loading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      console.log("LOG firebaseUser", firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    console.log("LOG", email, password);

    await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
    router.replace("/(tabs)"); // Redirect to home after login
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // await user.sendEmailVerification()

    await sendEmailVerification(response.user);

    setLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      register,
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
