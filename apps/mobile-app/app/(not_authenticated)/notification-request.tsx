import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import StyledText from "@/components/commons/StyledText";
import { PageView } from "@/components/Themed";
import { router } from "expo-router";
import { Dimensions, Image, Text } from "react-native";

const { width } = Dimensions.get("window");

export default function EmailVerification() {
  return (
    <PageView>
      <Flex
        direction="column"
        justify="space-between"
        style={{
          height: "100%",
        }}
      >
        <Text>ciaos</Text>
        {/* <Flex direction="column" gap={16}>
          <Image
            source={require("./../../assets/images/marketing-newsletter.png")}
            style={{
              width: width * 0.6,
              height: width * 0.6,
              alignSelf: "center",
            }}
          />
          <StyledText kind="h1">Controlla la posta</StyledText>
          <StyledText kind="body">
            Abbiamo inviato un'email all'indirizzo che hai fornito. Per
            completare la registrazione, apri la tua casella di posta e clicca
            sul link di verifica. Dopo aver confermato l'email, potrai accedere
            all'app. Se non trovi l'email, controlla anche nella cartella Spam o
            Promozioni.
          </StyledText>
        </Flex>

        <Button
          kind="primary"
          title="Vai alla schermata di accesso"
          onPress={() => {
            router.replace("/(auth)/login");
          }}
        />*/}
      </Flex>
    </PageView>
  );
}
