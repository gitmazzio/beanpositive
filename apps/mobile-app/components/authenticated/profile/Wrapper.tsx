import Flex, { FlexProps } from "@/components/commons/Flex";
import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

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
