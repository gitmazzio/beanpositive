import { StyleSheet, TouchableOpacity } from "react-native";
import StyledText from "./StyledText";

type ButtonProps = {
  onPress: () => void;
  title?: string;
  style?: any;
  disabled?: boolean;
  kind?: "primary" | "secondary" | "tertiary";
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
};

export const Button = ({
  onPress,
  title,
  style,
  disabled = false,
  kind = "primary",
  prefixIcon,
  suffixIcon,
}: ButtonProps) => {
  let textStyle = styles.buttonText;
  let buttonStyle = styles.primary;
  if (kind === "secondary") buttonStyle = styles.secondary;
  if (kind === "tertiary") {
    textStyle = styles.tertiaryText;
    buttonStyle = styles.tertiary;
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.buttonContainer,
        buttonStyle,
        disabled && styles.disabled,
        !title && styles.buttonCircle,
        style,
      ]}
    >
      {prefixIcon}
      {title != null && (
        <StyledText
          kind="button"
          style={[textStyle, disabled ? styles.disabledText : undefined]}
        >
          {title}
        </StyledText>
      )}
      {suffixIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  buttonCircle: {
    borderRadius: 100,
    width: 48,
    height: 48,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  buttonText: {
    color: "white",
  },
  primary: {
    backgroundColor: "#D57E3A",
  },
  secondary: {
    backgroundColor: "#F5E9DA",
    borderWidth: 1,
    borderColor: "#EAB68F",
  },
  tertiary: {
    backgroundColor: "#F1D8B7",
    borderWidth: 1,
    borderColor: "#F1D8B7",
  },
  tertiaryText: {
    color: "#3A1A10",
  },
  disabled: {
    backgroundColor: "#C9B3A4",
    borderColor: "#C9B3A4",
    opacity: 0.6,
  },
  disabledText: {
    color: "white",
  },
});
