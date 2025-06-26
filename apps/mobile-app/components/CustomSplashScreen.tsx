import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function CustomSplashScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation duration matches Lottie duration (2s for example)
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2000); // Adjust to your Lottie duration
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LottieView
        source={require("../assets/lottie/splash.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#7D8557",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  lottie: {
    // marginTop: 50,
    width: 375,
    height: 375,
  },
});
