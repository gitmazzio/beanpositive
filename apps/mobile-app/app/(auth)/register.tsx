import { Button } from "@/components/commons/Button";
import Checkbox from "@/components/commons/Checkbox";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import Link from "@/components/commons/Link";
import PasswordInput from "@/components/commons/PasswordInput";
import StyledText from "@/components/commons/StyledText";
import TextInput from "@/components/commons/TextInput";
import { PageView } from "@/components/Themed";
import { useAuth } from "@/providers";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet } from "react-native";

export default function Register() {
  const { loading, register } = useAuth();

  const methods = useForm({
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await register(data.email, data.password, {
        firstName: data.firstName,
      });
      Alert.alert("Success", "Registration successful!");
    } catch (err: any) {
      setError("root", { message: err.message || "Registration failed" });
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
            <StyledText kind="h1">Crea il tuo account</StyledText>
            <StyledText kind="body">
              Conserva ogni singolo momento creando un account su Bean Positive
            </StyledText>
            <Flex align="stretch" direction="column" gap={6}>
              <TextInput
                name="firstName"
                label="Il tuo nome"
                placeholder="Scrivi il tuo nome..."
                rules={{ required: "Il nome è obbligatorio" }}
              />

              <TextInput
                name="email"
                label="Email"
                placeholder="Usa il tuo indirizzo email..."
                rules={{
                  required: "Email obbligatoria",
                  pattern: { value: /^\S+@\S+$/i, message: "Email non valida" },
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <PasswordInput
                name="password"
                label="La tua password"
                placeholder="Inserisci qui la tua password..."
                rules={{
                  required: "Password obbligatoria",
                  minLength: { value: 8, message: "Minimo 8 caratteri" },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]).{8,}$/,
                    message:
                      "Almeno una minuscola, una maiuscola e un carattere speciale",
                  },
                }}
                hintText="Almeno 8 caratteri, 1 maiuscola, 1 minuscola"
              />

              <Checkbox
                name="acceptTerms"
                label={
                  <StyledText kind="caption">
                    Accetto i <Link href="/terms">termini e condizioni</Link> e
                    la <Link href="/privacy">privacy policy</Link> di Bean
                    Positive.
                  </StyledText>
                }
                style={{ marginTop: 8 }}
              />
            </Flex>

            <Button
              kind="primary"
              title="Continua"
              onPress={handleSubmit(onSubmit)}
              disabled={
                isSubmitting || loading || Object.keys(errors)?.length > 0
              }
            />
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
});
