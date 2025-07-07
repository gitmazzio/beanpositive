import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardDismiss } from "./commons/KeyboardDismiss";
// import styled from 'styled-components/native'
// import { colors } from '~/constants/colors'

const safeAreaPaddingTop =
  Platform.OS === "android" ? StatusBar.currentHeight : 0;

type Attrs = {
  flex?: 0 | 1;
  children?: ReactNode;
  insets?: { bottom: number; top: number };
};

export const AppSafeAreaView: React.FC<Attrs> = ({
  flex = 1,
  children,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex,
        backgroundColor: "#FEF5E6",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <KeyboardDismiss>
          <View
            style={{
              flex: 1,
              paddingBottom: insets.bottom === 0 ? 20 : insets.bottom,
              paddingTop: insets.top === 0 ? 12 : insets.top,
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
