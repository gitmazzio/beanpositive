import { Wrapper } from "@/components/authenticated/profile/Wrapper";
import { Button } from "@/components/commons/Button";
import { Header } from "@/components/commons/Header";
import StyledText from "@/components/commons/StyledText";
import PasswordInput from "@/components/commons/PasswordInput";
import { useAuth } from "@/providers";
import { supabase } from "@/services/supabase";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import TextInput from "@/components/commons/TextInput";

export default function Account() {
  const { user } = useAuth();

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      email: user?.user_metadata?.email || "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    watch,
  } = methods;

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", { message: "Le password non coincidono" });
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      if (error) throw error;
      Alert.alert("Successo", "Password aggiornata!");
      methods.reset();
    } catch (err: any) {
      setError("newPassword", {
        message: err.message || "Errore aggiornamento",
      });
    }
  };

  return (
    <Wrapper gap={16}>
      <Header withBack onPressBack={() => router.back()} />
      <StyledText kind="h1">Account</StyledText>
      <StyledText kind="body">
        Inserisci la nuova password e confermala per aggiornare le tue
        credenziali.
      </StyledText>
      <FormProvider {...methods}>
        <TextInput
          name="email"
          label="Email"
          placeholder="Usa il tuo indirizzo email..."
          autoCapitalize="none"
          keyboardType="email-address"
          disabled
        />
        <PasswordInput
          name="newPassword"
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
        <PasswordInput
          name="confirmPassword"
          label="Conferma password"
          placeholder="Ripeti la nuova password..."
          rules={{
            required: "Conferma la password",
            validate: (value: string) =>
              value === newPassword || "Le password non coincidono",
          }}
        />
        <Button
          kind="primary"
          title="Aggiorna password"
          onPress={handleSubmit(onSubmit)}
          disabled={
            isSubmitting ||
            Object.keys(errors).length > 0 ||
            !newPassword ||
            !confirmPassword
          }
        />
      </FormProvider>
    </Wrapper>
  );
}
