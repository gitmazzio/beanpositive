import { Button } from "@/components/commons/Button";
import { Header } from "@/components/commons/Header";
import StyledText from "@/components/commons/StyledText";
import TextInput from "@/components/commons/TextInput";
import { PageView } from "@/components/Themed";
import { useAuth } from "@/providers";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native";

export default function Register() {
  const { loading, login } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);

      Alert.alert("Success", "Sign in successful!");
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageView>
      <Header
        withBack
        onPressBack={() => {
          if (router.canGoBack()) {
            router.back();
          }
        }}
      ></Header>
      <StyledText kind="h1">Accedi su Bean Positive</StyledText>
      <StyledText kind="body">
        Usa i tuoi dati per accedere a Bean Positive.
      </StyledText>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email || ""}
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
      {isLoading || loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button
          kind="primary"
          title="Accedi"
          onPress={handleSignIn}
          disabled={!email || !password}
        />
      )}
    </PageView>
  );
}

const styles = StyleSheet.create({
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
