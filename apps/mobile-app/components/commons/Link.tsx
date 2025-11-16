import { useRouter } from "expo-router";
import { NavigationOptions } from "expo-router/build/global-state/routing";
import React from "react";
import {
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
} from "react-native";

interface LinkProps {
  to?: string;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  params?: NavigationOptions;
}

const isExternal = (url: string) => /^https?:\/\//.test(url);

export default function Link({
  to,
  children,
  style,
  onPress,
  params,
}: LinkProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (isExternal(to)) {
      Linking.openURL(to);
    } else {
      router.push(to as any);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} accessibilityRole="link">
      <Text style={[styles.link, style]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    color: "#3A1A10",
    textDecorationLine: "underline",
    fontWeight: "700",
    fontSize: 16,
  },
});
