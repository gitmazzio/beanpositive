/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  StatusBar,
  StyleSheet,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import { useDeviceType } from "@/app/hooks/useDeviceType";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export const PageView = (props: ViewProps) => {
  const {
    style,
    lightColor = "#FEF5E6",
    darkColor = "#FEF5E6",
    ...otherProps
  } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const { isIPhoneSE } = useDeviceType();

  return (
    <>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#FEF5E6"} />
      <DefaultView
        style={[
          styles.container,
          { backgroundColor },
          isIPhoneSE ? { paddingBottom: 20, paddingTop: 20 } : null,
          style,
        ]}
        {...otherProps}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
});
