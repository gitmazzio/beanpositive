import React, { useState } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  StyleSheetProperties,
  ViewStyle,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Flex from "./Flex";
import { Controller, useFormContext } from "react-hook-form";
import StyledText from "./StyledText";

interface CheckboxProps {
  name: string;
  label?: React.ReactNode; // Can be string, JSX, or include <Link>
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Checkbox({
  label,
  disabled,
  name,
  ...props
}: CheckboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods

  const error = errors?.[name];

  return (
    <Flex
      gap={4}
      direction="column"
      align="stretch"
      justify="flex-start"
      {...props}
    >
      <Controller
        control={control}
        name="acceptTerms"
        rules={{ required: "Devi accettare i termini e la privacy" }}
        render={({ field: { value, onChange } }) => (
          <Flex gap={8} direction="row" justify="flex-start" align="flex-start">
            <Pressable
              onPress={() => !disabled && onChange?.(!value)}
              style={({ pressed }) => [
                styles.container,
                disabled && { opacity: 0.5 },
                pressed && !disabled && { opacity: 0.7 },
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: value, disabled }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={[styles.box, value && styles.boxChecked]}>
                {value && <FontAwesome name="check" size={16} color="#fff" />}
              </View>
            </Pressable>
            {label != null && <View>{label}</View>}
          </Flex>
        )}
      />
      {error != null && (
        <StyledText kind="caption" style={styles.error}>
          {error?.message as string}
        </StyledText>
      )}
    </Flex>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#DEE0E3",
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    backgroundColor: "#D57E3A",
    borderColor: "#D57E3A",
  },
  error: {
    color: "#FF5A5F",
  },
});
