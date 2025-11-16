import { StyleSheet } from "react-native";
import { Text, TextProps } from "./Themed";

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />;
}

export const Title = (props: TextProps) => {
  return (
    <Text
      {...props}
      style={[styles.title, props.style, { fontFamily: "DynaPuff" }]}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#404B35",
  },
});
