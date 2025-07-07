import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
} from "react-native";

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  withError?: boolean;
}

export default function TextInput({
  label,
  error,
  style,
  withError = true,
  ...props
}: TextInputProps) {
  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNTextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor="#A0A0A0"
        {...props}
      />
      {withError && error ? <Text style={styles.error}>{error}</Text> : null}
    </>
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#222",
  },
  inputError: {
    borderColor: "#FF5A5F",
  },
  error: {
    color: "#FF5A5F",
    marginTop: 4,
    fontSize: 13,
  },
});
