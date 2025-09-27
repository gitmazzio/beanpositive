import { Wrapper } from "@/components/authenticated/profile/Wrapper";
import { Button } from "@/components/commons/Button";
import { Header } from "@/components/commons/Header";
import StyledText from "@/components/commons/StyledText";
import TextInput from "@/components/commons/TextInput";
import { useAuth } from "@/providers";
import { supabase } from "@/services/supabase";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, View } from "react-native";

export default function ProfileDetails() {
  const { user } = useAuth();
  const initialFirstName = user?.user_metadata?.firstName || "";

  const methods = useForm({
    defaultValues: {
      firstName: user?.user_metadata?.firstName || "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    watch,
  } = methods;

  const currentFirstName = watch("firstName");

  const onSubmit = async (data: { firstName: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { firstName: data.firstName },
      });
      if (error) throw error;
      // Alert.alert("Successo", "Nome aggiornato!");
    } catch (err: any) {
      setError("firstName", { message: err.message || "Errore aggiornamento" });
    }
  };

  return (
    <Wrapper gap={16}>
      <Header withBack onPressBack={() => router.back()} />
      <StyledText kind="h1">Dettagli</StyledText>
      <StyledText kind="body">
        Modifica i dettagli del tuo profilo. Questi saranno visibili solo a te.
      </StyledText>
      <FormProvider {...methods}>
        <TextInput
          name="firstName"
          label="Il tuo nome"
          placeholder="Modifica il tuo nome..."
          rules={{ required: "Il nome è obbligatorio" }}
        />

        <Button
          kind="primary"
          title="Conferma modifiche"
          onPress={handleSubmit(onSubmit)}
          disabled={
            isSubmitting ||
            Object.keys(errors).length > 0 ||
            currentFirstName === initialFirstName
          }
        />
      </FormProvider>
    </Wrapper>
  );
}
