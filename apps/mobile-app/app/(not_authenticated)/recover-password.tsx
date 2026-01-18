import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import PasswordInput from "@/components/commons/PasswordInput";
import StyledText from "@/components/commons/StyledText";
import TextInput from "@/components/commons/TextInput";
import { PageView } from "@/components/Themed";
import { supabase } from "@/services/supabase";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator } from "react-native";
// ...other imports...

export default function RecoverPassword() {
  // ...existing code...
  const [error, setError] = useState<string | null>(null);

  const methods = useForm({
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: { email: string }) => {
    setError(null);
    try {
      // Genera l'URL di redirect usando lo stesso scheme dell'app
      const mobileRedirectTo = AuthSession.makeRedirectUri({
        scheme: "beanpositive",
        path: "reset-password",
      });

      // URL web come fallback per desktop (usa il Site URL di Supabase o un tuo dominio)
      // Se hai un sito web, sostituisci con il tuo URL: https://tuosito.com/reset-password
      // Altrimenti, Supabase userà il Site URL configurato nel dashboard
      const webRedirectTo =
        process.env.EXPO_PUBLIC_WEB_URL ||
        process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(
          ".supabase.co",
          ".supabase.co/auth/v1/reset-password"
        ) ||
        mobileRedirectTo;

      // Usa l'URL mobile se disponibile, altrimenti fallback web
      // Supabase proverà prima il deep link, poi il web URL se il deep link non funziona
      const redirectTo = mobileRedirectTo;

      console.log("🔗 Redirect URL mobile:", mobileRedirectTo);
      console.log("🔗 Redirect URL web (fallback):", webRedirectTo);

      const { data: resetPasswordData, error } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo,
        }
      );

      console.log("LOG RESET PASSWORD DATA", resetPasswordData);

      if (error) throw error;

      router.push("/(not_authenticated)/check-email");
    } catch (err: any) {
      console.log("LOG ERROR", err);

      const errorMessage =
        err.message || "Errore nell'invio dell'email di recupero";
      setError(errorMessage);
    }
  };

  return (
    <PageView>
      {/* ...existing code... */}
      <FormProvider {...methods}>
        <Flex direction="column" gap={16} justify="flex-start" align="stretch">
          <Header
            withBack
            onPressBack={() => {
              if (router.canGoBack()) {
                router.back();
              }
            }}
          ></Header>
          <StyledText kind="h1">Recupera la password</StyledText>
          <StyledText kind="body">
            Invieremo un'email con un link per reimpostare la tua password.
            Clicca sul link nell'email per creare una nuova password. Se apri
            il link da desktop, verrai reindirizzato a una pagina web. Se non
            trovi l'email, controlla anche nella cartella Spam o Promozioni.
          </StyledText>

          <TextInput
            name="email"
            label="Email"
            placeholder="Usa il tuo indirizzo email..."
            autoCapitalize="none"
            keyboardType="email-address"
            rules={{
              required: "Email obbligatoria",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                message: "Email non valida",
              },
            }}
          />
          {error && (
            <StyledText kind="caption" style={{ color: "red" }}>
              {error}
            </StyledText>
          )}
          {isSubmitting /* || loading */ ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Button
              kind="primary"
              title="Invia email di recupero"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || Object.keys(errors)?.length > 0}
            />
          )}
        </Flex>
      </FormProvider>
      {/* ...existing code... */}
    </PageView>
  );
}
