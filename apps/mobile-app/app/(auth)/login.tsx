import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

GoogleSignin.configure({
  webClientId:
    "532957611936-0icd54pbm5qnns195tpus3154nvn4b4d.apps.googleusercontent.com",
});

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const signInResult = await GoogleSignin.signIn();

      console.log("LOG", signInResult);

      if (signInResult.type === "success") {
        // use signInResponse.data

        // Use idToken directly from signInResult
        const idToken = signInResult.data.idToken;
        if (!idToken) {
          // User closed modal or did not complete sign-in
          setError("Google sign-in was cancelled or failed.");
          return;
        }
        const googleCredential = GoogleAuthProvider.credential(idToken);
        const auth = getAuth();
        await signInWithCredential(auth, googleCredential);
      }

      if (signInResult.type === "cancelled") {
        return;
      }
    } catch (err: any) {
      setError(err.message || "Google login failed");
      Alert.alert("Google Login Error", err.message || "Google login failed");
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
      Alert.alert("Login Error", err.message || "Login failed");
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/(auth)/register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? (
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
      ) : null}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <Button
        title="Don't have an account? Register"
        onPress={handleRegisterRedirect}
        color="#888"
      />
      <Button
        title="Sign in with Google"
        onPress={onGoogleButtonPress}
        color="#4285F4"
      />
      <Button
        title="test onboarding"
        onPress={async () => {
          await AsyncStorage.removeItem("onboardingSeen");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
