// app/profile.tsx
import { SectionButton } from "@/components/authenticated/profile/SectionButton";
import { Wrapper } from "@/components/authenticated/profile/Wrapper";
import Flex from "@/components/commons/Flex";
import StyledText from "@/components/commons/StyledText";
import { useAuth } from "@/providers";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";

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
        title="Account"
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
      <Button title="logout" onPress={logout} />
    </Wrapper>
  );
}
