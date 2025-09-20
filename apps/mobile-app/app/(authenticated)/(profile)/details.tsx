import { Wrapper } from "@/components/authenticated/profile/Wrapper";
import { Header } from "@/components/commons/Header";
import StyledText from "@/components/commons/StyledText";
import { router } from "expo-router";

export default function DetailsScreen() {
  return (
    <Wrapper gap={16}>
      <Header withBack onPressBack={() => router.back()} />
      <StyledText kind="h1">Dettagli</StyledText>
    </Wrapper>
  );
}
