import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import TextInput, { TextInputProps } from "./TextInput";

export default function PasswordInput(props: TextInputProps) {
  const [show, setShow] = useState(false);

  return (
    <TextInput
      {...props}
      secureTextEntry={!show}
      rightIcon={
        <TouchableOpacity
          onPress={() => setShow((s) => !s)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome
            name={show ? "eye-slash" : "eye"}
            size={20}
            color="#000000"
          />
        </TouchableOpacity>
      }
      label={props.label || "Password"}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}
