// app/profile.tsx
import { SectionButton } from "@/components/authenticated/profile/SectionButton";
import { Wrapper } from "@/components/authenticated/profile/Wrapper";
import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import StyledText from "@/components/commons/StyledText";
import { useAuth } from "@/providers";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <Wrapper gap={16}>
      <Flex direction="row" align="center" justify="space-between">
        <StyledText kind="h1">Il tuo profilo</StyledText>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <FontAwesome6 name="xmark" size={20} />
        </TouchableOpacity>
      </Flex>
      <StyledText kind="body">{user?.email}</StyledText>
      <StyledText kind="headline">Profilo</StyledText>
      <SectionButton
        title="Dettagli"
        icon="user"
        url={"/(authenticated)/(profile)/details"}
      />
      <SectionButton
        title="Notifiche"
        icon="bell"
        url={"/(authenticated)/(profile)/notifications"}
      />
      <SectionButton
        title="Account"
        icon="gear"
        url={"/(authenticated)/(profile)/account"}
      />
      <StyledText kind="headline">Supporto e Community</StyledText>
      <SectionButton
        title="Aiuto e supporto"
        icon="circle-info"
        url={"/(authenticated)/(profile)"}
        rightIcon="arrow-up-right-from-square"
        disabled
      />
      <SectionButton
        title="Condividi con i tuoi amici"
        icon="share-nodes"
        url={"/(authenticated)/(profile)"}
        rightIcon="arrow-up-right-from-square"
        disabled
      />
      <Button title="Esci dal tuo account" onPress={logout} kind="link" />
    </Wrapper>
  );
}
