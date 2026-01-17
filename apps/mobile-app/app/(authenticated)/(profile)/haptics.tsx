import { Wrapper } from "@/components/authenticated/profile/Wrapper";
import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import StyledText from "@/components/commons/StyledText";
import {
  triggerAndroidHaptic,
  triggerImpactHaptic,
  triggerNotificationHaptic,
  triggerSelectionHaptic,
} from "@/utils/haptics";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Platform, ScrollView } from "react-native";

export default function HapticsExamplesScreen() {
  return (
    <Wrapper>
      <Header withBack onPressBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <Flex direction="column" gap={8}>
          <StyledText kind="h1">Haptics</StyledText>
          <StyledText kind="body">
            Esempi di feedback aptico per selezioni, impatti e notifiche.
          </StyledText>
        </Flex>

        <Flex direction="column" gap={12}>
          <StyledText kind="headline">Selezione</StyledText>
          <Button
            title="Selection"
            onPress={() => triggerSelectionHaptic()}
          />
        </Flex>

        <Flex direction="column" gap={12}>
          <StyledText kind="headline">Impact</StyledText>
          <Flex direction="column" gap={8}>
            <Button
              kind="secondary"
              title="Light"
              onPress={() =>
                triggerImpactHaptic(Haptics.ImpactFeedbackStyle.Light)
              }
            />
            <Button
              kind="secondary"
              title="Medium"
              onPress={() =>
                triggerImpactHaptic(Haptics.ImpactFeedbackStyle.Medium)
              }
            />
            <Button
              kind="secondary"
              title="Heavy"
              onPress={() =>
                triggerImpactHaptic(Haptics.ImpactFeedbackStyle.Heavy)
              }
            />
            <Button
              kind="secondary"
              title="Rigid"
              onPress={() =>
                triggerImpactHaptic(Haptics.ImpactFeedbackStyle.Rigid)
              }
            />
            <Button
              kind="secondary"
              title="Soft"
              onPress={() =>
                triggerImpactHaptic(Haptics.ImpactFeedbackStyle.Soft)
              }
            />
          </Flex>
        </Flex>

        <Flex direction="column" gap={12}>
          <StyledText kind="headline">Notification</StyledText>
          <Flex direction="column" gap={8}>
            <Button
              kind="secondary"
              title="Success"
              onPress={() =>
                triggerNotificationHaptic(
                  Haptics.NotificationFeedbackType.Success
                )
              }
            />
            <Button
              kind="secondary"
              title="Warning"
              onPress={() =>
                triggerNotificationHaptic(
                  Haptics.NotificationFeedbackType.Warning
                )
              }
            />
            <Button
              kind="secondary"
              title="Error"
              onPress={() =>
                triggerNotificationHaptic(
                  Haptics.NotificationFeedbackType.Error
                )
              }
            />
          </Flex>
        </Flex>

        {Platform.OS === "android" ? (
          <Flex direction="column" gap={12}>
            <StyledText kind="headline">Android Engine</StyledText>
            <Flex direction="column" gap={8}>
              <Button
                kind="secondary"
                title="Confirm"
                onPress={() =>
                  triggerAndroidHaptic(Haptics.AndroidHaptics.Confirm)
                }
              />
              <Button
                kind="secondary"
                title="Reject"
                onPress={() =>
                  triggerAndroidHaptic(Haptics.AndroidHaptics.Reject)
                }
              />
              <Button
                kind="secondary"
                title="Long Press"
                onPress={() =>
                  triggerAndroidHaptic(Haptics.AndroidHaptics.Long_Press)
                }
              />
            </Flex>
          </Flex>
        ) : null}
      </ScrollView>
    </Wrapper>
  );
}
