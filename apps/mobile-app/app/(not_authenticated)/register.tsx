import { Button } from "@/components/commons/Button";
import Checkbox from "@/components/commons/Checkbox";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import Link from "@/components/commons/Link";
import PasswordInput from "@/components/commons/PasswordInput";
import StyledText from "@/components/commons/StyledText";
import TextInput from "@/components/commons/TextInput";
import { PageView } from "@/components/Themed";
import { useOpenBrowser } from "@/hooks/useOpenBrowser";
import { useAuth } from "@/providers";
import {
  IT_ERROR_CODES,
  SupabaseErrorCode,
} from "@/utils/supabase_error_codes";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";

export default function Register() {
  const { openBrowser } = useOpenBrowser();
  const router = useRouter();
  const { loading, register, setAuthIsLoading } = useAuth();

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
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: any) => {
    // Valida che i termini siano accettati
    if (!data.acceptTerms) {
      setError("acceptTerms", {
        message: "Devi accettare i termini e condizioni per continuare",
      });
      return;
    }

    try {
      setAuthIsLoading(true);
      await register(data.email, data.password, {
        firstName: data.firstName,
      });

      router.push("/(not_authenticated)/email-verification");
    } catch (err: any) {
      const errorMessage =
        IT_ERROR_CODES[err.code as SupabaseErrorCode] ??
        err.message ??
        "Errore durante la registrazione";
      setError("root", { message: errorMessage });
    } finally {
      setAuthIsLoading(false);
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
            <Flex align="stretch" direction="column" gap={8}>
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
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                    message: "Email non valida",
                  },
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
                  validate: {
                    hasLowerCase: (value: string) =>
                      /[a-z]/.test(value) ||
                      "Almeno una lettera minuscola richiesta",
                    hasUpperCase: (value: string) =>
                      /[A-Z]/.test(value) ||
                      "Almeno una lettera maiuscola richiesta",
                    hasSpecialChar: (value: string) =>
                      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) ||
                      "Almeno un carattere speciale richiesto",
                  },
                }}
                // hintText="Almeno 8 caratteri, 1 maiuscola, 1 minuscola, 1 carattere speciale"
              />

              <Checkbox
                name="acceptTerms"
                rules={{
                  required: "Devi accettare i termini e condizioni per continuare",
                }}
                label={
                  <Flex
                    style={{
                      maxWidth: "95%",
                    }}
                  >
                    <StyledText kind="caption">
                      Accetto i{" "}
                      <Link
                        onPress={() =>
                          openBrowser("https://www.beanpositive.app/termini")
                        }
                        style={{
                          fontSize: 14,
                        }}
                      >
                        termini e condizioni
                      </Link>{" "}
                      e la{" "}
                      <Link
                        onPress={() =>
                          openBrowser("https://www.beanpositive.app/privacy")
                        }
                        style={{
                          fontSize: 14,
                        }}
                      >
                        privacy policy
                      </Link>{" "}
                      di Bean Positive.
                    </StyledText>
                  </Flex>
                }
                style={{ marginTop: 8 }}
              />
            </Flex>

            {errors.root && (
              <StyledText kind="caption" style={{ color: "red" }}>
                {errors.root.message}
              </StyledText>
            )}

            <Button
              kind="primary"
              title="Continua"
              onPress={handleSubmit(onSubmit)}
              disabled={
                isSubmitting ||
                loading ||
                Object.keys(errors)?.length > 0 ||
                !acceptTerms
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
