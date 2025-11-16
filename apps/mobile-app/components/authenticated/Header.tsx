import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StyledText from "../commons/StyledText";
import Flex from "../commons/Flex";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "@/providers";
import { router } from "expo-router";

export const Header = () => {
  const { user } = useAuth();

  const { user_metadata: metadata } = user as any;

  return (
    <Flex style={{ height: 48 }} align="center" justify="space-between">
      <View style={styles.button} />
      {/* <TouchableOpacity style={styles.button} hitSlop={10}>
        <FontAwesome6 name="hand-holding-heart" size={20} color="#C7682F" />
      </TouchableOpacity> */}
      <Flex direction="column">
        <StyledText
          kind="h1"
          style={{
            fontSize: 20,
            color: "#C7682F",
          }}
          textAlign="center"
        >
          {metadata?.firstName ? `Ciao ${metadata?.firstName}` : "ciao"}
        </StyledText>
        <StyledText
          kind="caption"
          style={{
            fontWeight: 500,
          }}
        >
          Cosa ti ha reso felice oggi?
        </StyledText>
      </Flex>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/(authenticated)/(profile)");
        }}
        hitSlop={10}
      >
        <FontAwesome6 name="user" size={20} color="#C7682F" solid />
      </TouchableOpacity>
    </Flex>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
