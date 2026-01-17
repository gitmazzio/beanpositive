import Flex, { FlexProps } from "@/components/commons/Flex";
import { toastConfig } from "@/utils/toastConfig";
import { type ReactNode } from "react";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native";

type Props = FlexProps & {
  children: ReactNode;
};

export const Wrapper = ({ children, ...props }: Props) => {
  return (
    <Flex
      justify="flex-start"
      direction="column"
      style={styles.wrapper}
      {...props}
    >
      {children}
      <Toast config={toastConfig} />
    </Flex>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8EDDC",
    padding: 24,
  },
});
