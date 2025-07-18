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
      await supabase.auth.resetPasswordForEmail(data.email);
      router.push("/email-verification");
    } catch (err: any) {
      setError(err.message);
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
            Invieremo una password temporanea al tuo indirizzo email. Potrai
            cambiarla una volta effettuato l’accesso.
          </StyledText>

          <TextInput
            name="email"
            label="Email"
            placeholder="Usa il tuo indirizzo email..."
            autoCapitalize="none"
            keyboardType="email-address"
            rules={{
              required: "Email obbligatoria",
              pattern: { value: /^\S+@\S+$/i, message: "Email non valida" },
            }}
          />
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
