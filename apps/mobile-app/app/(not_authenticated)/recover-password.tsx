import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import PasswordInput from "@/components/commons/PasswordInput";
import StyledText from "@/components/commons/StyledText";
import TextInput from "@/components/commons/TextInput";
import { PageView } from "@/components/Themed";
import { supabase } from "@/services/supabase";
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
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: "beanpositive://reset-password",
      });

      if (error) throw error;

      router.push("/(not_authenticated)/check-email");
    } catch (err: any) {
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
            Clicca sul link nell'email per creare una nuova password. Se non
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
