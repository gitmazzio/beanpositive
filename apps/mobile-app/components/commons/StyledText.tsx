import React from "react";
import { StyleSheet, Text, TextProps, View } from "react-native";
import Flex from "./Flex";

// Define the available text kinds
type TextKind =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "caption"
  | "button"
  | "overline"
  | "subtitle";

interface StyledTextProps extends TextProps {
  kind: TextKind;
  textAlign?: "left" | "center" | "right" | "justify";
  children: React.ReactNode;
}

const StyledText: React.FC<StyledTextProps> = ({
  kind,
  children,
  style,
  textAlign,
  ...props
}) => {
  const alignmentStyle = textAlign ? { textAlign } : {};

  return (
    <Flex
      align="flex-start"
      justify="flex-start"
      direction="row"
      style={{ flexWrap: "wrap" }}
    >
      {React.Children.map(children, (child) => (
        <Text style={[styles[kind], alignmentStyle, style]} {...props}>
          {child}
        </Text>
      ))}
    </Flex>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontFamily: "DynaPuff",
    fontSize: 24,
    color: "#404B35",
  },
  h2: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  h3: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  subtitle: {
    fontFamily: "Figtree-Medium",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
    color: "#4a4a4a",
  },
  body: {
    fontFamily: "Figtree",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: "#381110",
  },
  caption: {
    fontFamily: "Figtree-Regular",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: "#381110",
  },
  button: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: "#ffffff",
    textAlign: "center",
  },
  overline: {
    fontFamily: "Figtree-Medium",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "#8a8a8a",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});

export default StyledText;
