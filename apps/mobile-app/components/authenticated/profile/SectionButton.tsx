import Flex from "@/components/commons/Flex";
import StyledText from "@/components/commons/StyledText";
import { FontAwesome6 } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

type Props = {
  url: Href;
  title: string;
  icon?: string;
  rightIcon?: string;
  disabled?: boolean;
};

export const SectionButton = ({
  url,
  title,
  icon,
  rightIcon,
  disabled = false,
}: Props) => {
  return (
    <TouchableOpacity onPress={() => router.push(url)} disabled={disabled}>
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        style={[styles.button, disabled ? styles.disabled : null]}
      >
        <Flex direction="row" gap={12} align="center">
          {icon != null && (
            <FontAwesome6 name={icon} size={18} solid color="#3A1A10" />
          )}
          <StyledText
            kind="button"
            style={{
              fontWeight: 600,
              color: "#3A1A10",
            }}
          >
            {title}
          </StyledText>
        </Flex>
        <FontAwesome6
          name={rightIcon ?? "chevron-right"}
          size={16}
          color="#3A1A10"
          style={{
            opacity: 0.5,
          }}
        />
      </Flex>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FCF7F0",
    padding: 12,
    borderRadius: 12,
    borderColor: "#F1D8B7",
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
