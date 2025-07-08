import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import PasswordInput from "@/components/commons/PasswordInput";
import StyledText from "@/components/commons/StyledText";
import TextInput from "@/components/commons/TextInput";
import { PageView } from "@/components/Themed";
import { useAuth } from "@/providers";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";

export default function Register() {
  const { loading, login } = useAuth();

  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      Alert.alert("Success", "Registration successful!");
    } catch (err: any) {
      console.log("LOG err", err);
      Alert.alert("Error", "Error signin!");
      // setError("root", { message: err.message || "Registration failed" });
    }
  };

  return (
    <PageView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <FormProvider {...methods}>
          <Flex
            direction="column"
            gap={16}
            justify="flex-start"
            align="stretch"
          >
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
              name="email"
              label="Email"
              placeholder="Usa il tuo indirizzo email..."
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <PasswordInput
              name="password"
              label="La tua password"
              placeholder="Inserisci qui la tua password..."
              secureTextEntry
            />
            {/* {isSubmitting || loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : ( */}
            <Button
              kind="primary"
              title="Accedi"
              onPress={handleSubmit(onSubmit)}
              disabled={
                isSubmitting || loading || Object.keys(errors)?.length > 0
              }
            />
            {/* )} */}
          </Flex>
        </FormProvider>
      </ScrollView>
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
