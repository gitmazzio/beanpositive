import { StyleSheet, View, ViewStyle } from "react-native";

interface HorizontalLineProps {
  color?: string;
  thickness?: number;
  style?: ViewStyle;
  marginVertical?: number;
}

export default function HorizontalLine({
  color = "#E0E0E0",
  thickness = 1,
  style,
  marginVertical = 16,
}: HorizontalLineProps) {
  return (
    <View
      style={[
        styles.line,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    alignSelf: "center",
  },
});
