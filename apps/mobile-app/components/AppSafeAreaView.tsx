import React, { ReactNode } from "react";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import styled from 'styled-components/native'
// import { colors } from '~/constants/colors'

const safeAreaPaddingTop =
  Platform.OS === "android" ? StatusBar.currentHeight : 0;

type Attrs = {
  flex?: 0 | 1;
  children?: ReactNode;
  insets?: { bottom: number; top: number };
};

const StyledSafeAreaView = ({ children, flex, insets }) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {children}
    </View>
  );
};

// const StyledSafeAreaView = styled(View)<Attrs>`
//   background-color: ${colors.white};
//   flex: ${({ flex }) => flex};
//   margin-bottom: ${({ insets }) =>
//     Platform.OS === "android"
//       ? `${insets?.bottom}px`
//       : `-${(insets?.bottom || 0) / 2}px`};
//   margin-top: ${`${safeAreaPaddingTop}px`};
// `;

export const AppSafeAreaView: React.FC<Attrs> = ({
  flex = 1,
  children,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex }}>
      {/* <StyledSafeAreaView flex={flex} insets={insets} {...props}>
        {children}
      </StyledSafeAreaView> */}
      {children}
    </SafeAreaView>
  );
};

AppSafeAreaView.displayName = "AppSafeAreaView";
