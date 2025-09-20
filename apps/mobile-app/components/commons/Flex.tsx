import React from "react";
import { View, ViewProps, StyleSheet, ViewStyle } from "react-native";

export interface FlexProps extends ViewProps {
  direction?: "row" | "column";
  align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  gap?: number;
  style?: ViewStyle | any;
  children: React.ReactNode;
}

export default function Flex({
  direction = "row",
  align = "stretch",
  justify = "center",
  gap = 0,
  style,
  children,
  ...rest
}: FlexProps) {
  return (
    <View
      style={[
        styles.flex,
        {
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          gap,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    display: "flex",
  },
});
