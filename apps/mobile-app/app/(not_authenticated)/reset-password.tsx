import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import PasswordInput from "@/components/commons/PasswordInput";
import StyledText from "@/components/commons/StyledText";
import { PageView } from "@/components/Themed";
import { supabase } from "@/services/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator, Alert } from "react-native";
import * as Linking from "expo-linking";

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const params = useLocalSearchParams();

  const methods = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setError: setFormError,
  } = methods;

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Gestisci il deep link quando l'app viene aperta con beanpositive://reset-password
  useEffect(() => {
    const handleDeepLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log("🔗 Deep link ricevuto:", initialUrl);
          await processResetPasswordUrl(initialUrl);
        }
      } catch (error) {
        console.error("Errore nel processamento del deep link:", error);
      }
    };

    // Gestisci anche i deep link quando l'app è già aperta
    const subscription = Linking.addEventListener("url", async (event) => {
      console.log("🔗 Deep link ricevuto (app aperta):", event.url);
      await processResetPasswordUrl(event.url);
    });

    handleDeepLink();

    return () => {
      subscription.remove();
    };
  }, []);

  const processResetPasswordUrl = async (url: string) => {
    try {
      const parsedUrl = Linking.parse(url);
      const { queryParams, hostname } = parsedUrl;

      // Se l'URL contiene token nell'hash (come beanpositive://reset-password#access_token=...)
      if (url.includes("#")) {
        const hashPart = url.split("#")[1];
        const hashParams = new URLSearchParams(hashPart);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (type === "recovery" && accessToken && refreshToken) {
          console.log("✅ Token di recovery trovati nell'URL");
          // Imposta la sessione con i token di recovery
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error("❌ Errore nell'impostazione della sessione:", sessionError);
            setError("Link di reset non valido o scaduto");
            return;
          }

          console.log("✅ Sessione impostata, pronto per il reset password");
        }
      } else if (queryParams) {
        // Gestisci anche query parameters se presenti
        const accessToken = queryParams.access_token as string;
        const refreshToken = queryParams.refresh_token as string;
        const type = queryParams.type as string;

        if (type === "recovery" && accessToken && refreshToken) {
          console.log("✅ Token di recovery trovati nei query params");
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error("❌ Errore nell'impostazione della sessione:", sessionError);
            setError("Link di reset non valido o scaduto");
            return;
          }

          console.log("✅ Sessione impostata, pronto per il reset password");
        }
      }
    } catch (error) {
      console.error("Errore nel processamento dell'URL:", error);
      setError("Errore nel processamento del link di reset");
    }
  };

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      setFormError("confirmPassword", { message: "Le password non coincidono" });
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // Verifica che ci sia una sessione valida
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        throw new Error("Sessione non valida. Il link di reset potrebbe essere scaduto.");
      }

      // Aggiorna la password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) throw updateError;

      Alert.alert(
        "Password aggiornata",
        "La tua password è stata aggiornata con successo. Ora puoi accedere con la nuova password.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(not_authenticated)/login");
            },
          },
        ]
      );
    } catch (err: any) {
      console.error("Errore nel reset password:", err);
      const errorMessage =
        err.message || "Errore nell'aggiornamento della password";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageView>
      <FormProvider {...methods}>
        <Flex direction="column" gap={16} justify="flex-start" align="stretch">
          <Header
            withBack
            onPressBack={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(not_authenticated)/login");
              }
            }}
          />
          <StyledText kind="h1">Reimposta password</StyledText>
          <StyledText kind="body">
            Inserisci la tua nuova password. Assicurati che sia sicura e facile da ricordare.
          </StyledText>

          <PasswordInput
            name="password"
            label="Nuova password"
            placeholder="Inserisci la nuova password..."
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
            hintText="Almeno 8 caratteri, 1 maiuscola, 1 minuscola, 1 carattere speciale"
          />
          <PasswordInput
            name="confirmPassword"
            label="Conferma password"
            placeholder="Ripeti la nuova password..."
            rules={{
              required: "Conferma la password",
              validate: (value: string) =>
                value === password || "Le password non coincidono",
            }}
          />
          {error && (
            <StyledText kind="caption" style={{ color: "red" }}>
              {error}
            </StyledText>
          )}
          {isSubmitting || isProcessing ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Button
              kind="primary"
              title="Aggiorna password"
              onPress={handleSubmit(onSubmit)}
              disabled={
                isSubmitting ||
                isProcessing ||
                Object.keys(errors).length > 0 ||
                !password ||
                !confirmPassword
              }
            />
          )}
        </Flex>
      </FormProvider>
    </PageView>
  );
}
