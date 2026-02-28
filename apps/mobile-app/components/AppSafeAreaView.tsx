import React, { ReactNode } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardDismiss } from "./commons/KeyboardDismiss";

type Attrs = {
  isSplashShowing?: boolean;
  isOnboarding?: boolean;
  flex?: 0 | 1;
  children?: ReactNode;
  insets?: { bottom: number; top: number };
};

export const AppSafeAreaView: React.FC<Attrs> = ({
  isSplashShowing,
  isOnboarding = false,
  flex = 1,
  children,
  ...props
}) => {
  return (
    <SafeAreaView
      style={{
        flex,
        backgroundColor: isSplashShowing ? "#7D8557" : "#FEF5E6",
      }}
    >
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <KeyboardDismiss>
          <View
            style={{
              flex: 1,
            }}
          >
            {children}
          </View>
        </KeyboardDismiss>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

AppSafeAreaView.displayName = "AppSafeAreaView";
