import { Controller, useFormContext } from "react-hook-form";
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  View,
} from "react-native";
import Flex from "./Flex";
import { ReactNode, useState } from "react";
import StyledText from "./StyledText";

export interface TextInputProps extends RNTextInputProps {
  name: string;
  label?: string;
  withError?: boolean;
  rules?: object;
  rightIcon?: ReactNode;
  hintText?: string;
}

export default function TextInput({
  label,
  style,
  name,
  withError = true,
  rules,
  rightIcon,
  hintText,
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

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
      style={{ height: 95 }}
    >
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <View style={{ position: "relative" }}>
              <RNTextInput
                style={[
                  styles.input,
                  isFocused ? styles.inputFocused : null,
                  value ? styles.inputValue : null,
                  error ? styles.inputError : null,
                  style,
                ]}
                placeholderTextColor="#A0A0A0"
                value={value}
                onChangeText={onChange}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur?.();
                }}
                onFocus={() => setIsFocused(true)}
                selectionColor="#4D8BF7" // Custom caret and selection color
                {...props}
              />
              {rightIcon != null && (
                <View style={styles.rightIcon}>{rightIcon}</View>
              )}
            </View>
          );
        }}
      />
      {hintText && error == null && (
        <StyledText kind="caption">{hintText}</StyledText>
      )}
      {withError && error != null ? (
        <StyledText kind="caption" style={styles.error}>
          {error?.message as string}
        </StyledText>
      ) : null}
    </Flex>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    fontWeight: "500",
    color: "#333",
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputValue: {
    color: "#1C1C1C",
    fontWeight: "600", // Makes the input text bolder
  },
  inputError: {
    borderColor: "#FF5A5F",
  },
  error: {
    color: "#FF5A5F",
  },
  inputFocused: {
    borderColor: "#404B35",
    shadowColor: "#D08553",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 10,
    shadowRadius: 1,
    elevation: 2,
  },
  rightIcon: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
