import { FontAwesome6 } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "./Button";

type HeaderProps = {
  withBack?: boolean;
  children?: ReactNode;
  onPressBack?: () => void;
  leftChildren?: ReactNode;
};

export const Header = ({
  withBack = false,
  children,
  onPressBack,
  leftChildren,
}: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerButton}>
        {withBack ? (
          <Button
            kind="tertiary"
            prefixIcon={
              <FontAwesome6 name="arrow-left" size={20} color={"#686260"} />
            }
            onPress={onPressBack!}
          />
        ) : (
          <View style={styles.backButton} />
        )}
      </View>
      {/* Progress bar */}
      {children}
      {leftChildren != null && (
        <View style={[styles.headerButton, styles.leftElement]}>
          {leftChildren}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  headerButton: {
    flex: 0,
    width: 70,
    alignItems: "flex-start",
  },
  backButton: {
    width: 36,
    height: 36,
  },
  backText: {
    fontSize: 16,
    color: "#404B35",
    fontWeight: "500",
  },
  leftElement: {
    alignItems: "flex-end",
  },
  skipText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
});
