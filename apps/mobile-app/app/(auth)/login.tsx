import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import HorizontalLine from "@/components/commons/HorizontalLine";
import Link from "@/components/commons/Link";
import StyledText from "@/components/commons/StyledText";
import { PageView } from "@/components/Themed";
import { FontAwesome6 } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useState } from "react";
import { Alert, Image, Platform, StyleSheet } from "react-native";
import { useAuth } from "../../providers/AuthProvider";

GoogleSignin.configure({
  webClientId:
    "532957611936-0icd54pbm5qnns195tpus3154nvn4b4d.apps.googleusercontent.com",
});

export default function Login() {
  const { login, loading } = useAuth();
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
      router.push("/(auth)/register");
      // await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
      Alert.alert("Login Error", err.message || "Login failed");
    }
  };

  return (
    <PageView style={{ gap: 20 }}>
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
      {Platform.OS === "ios" ? (
        <Button
          kind="tertiary"
          prefixIcon={<FontAwesome6 name="apple" size={20} color={"#686260"} />}
          title="Continua con Apple"
          onPress={onGoogleButtonPress}
        />
      ) : null}
      <Button
        kind="tertiary"
        prefixIcon={<FontAwesome6 name="google" size={20} color={"#686260"} />}
        title="Continua con Google"
        onPress={onGoogleButtonPress}
      />
      <HorizontalLine color="#E0E0E0" thickness={1} marginVertical={0} />
      <Button
        kind="primary"
        title="Crea con la tua mail"
        onPress={handleLogin}
      />
      <Flex gap={4}>
        <StyledText kind="body">Hai già un account?</StyledText>
        <Link to={"/(auth)/signin"}>Accedi subito</Link>
      </Flex>

      {/* <Button
        title="test onboarding"
        onPress={async () => {
          await AsyncStorage.removeItem("onboardingSeen");
        }}
      /> */}
    </PageView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
});
