import Flex from "@/components/commons/Flex";
import StyledText from "@/components/commons/StyledText";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from "react-native-toast-message";

const { width } = Dimensions.get("window");

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  hintSuccess: ({ text1, props }) => (
    <Flex
      direction="row"
      gap={8}
      align="center"
      justify="space-between"
      style={styles.hintSuccessContainer}
    >
      <FontAwesome6 name="circle-check" size={16} color="#7D8557" solid />
      <StyledText kind="h1" style={styles.hintSuccessText}>
        {text1}
      </StyledText>
      <TouchableOpacity
        onPress={() => Toast.hide()}
        hitSlop={{
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        }}
        style={styles.hintSuccessClose}
      >
        <FontAwesome6 name="xmark" size={20} color="#636B45" solid />
      </TouchableOpacity>
    </Flex>
  ),
};

const styles = StyleSheet.create({
  hintSuccessContainer: {
    borderRadius: 12,
    backgroundColor: "#F5F5F0",
    borderColor: "#DEE0E3",
    borderWidth: 1,
    width: width - 40,
    padding: 16,
  },
  hintSuccessText: {
    fontSize: 14,
    color: "#000000",
  },
  hintSuccessClose: {
    justifyContent: "center",
    alignContent: "center",
  },
});
