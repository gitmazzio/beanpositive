import { Animated, Easing } from "react-native";

export const animationPrimaryPocket = ({ rotation, scale, move }) => {
  Animated.sequence([
    Animated.parallel([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(move, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]),

    // Hold for a moment
    Animated.delay(250),

    // Missing bump
    Animated.timing(scale, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),

    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),

    Animated.delay(50),

    // Turn back to center
    Animated.parallel([
      Animated.timing(rotation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(move, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
};

export const animationSecondaryPocket = ({ rotation, scale, move }) => {
  Animated.sequence([
    Animated.parallel([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(move, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]),

    // Hold for a moment

    // Missing bump
    Animated.timing(scale, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),

    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),

    Animated.delay(300),

    // Turn back to center
    Animated.parallel([
      Animated.timing(rotation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(move, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
};

export const beanAnimation = ({
  animatedValue,
  translateX,
  translateY,
  opacity,
}) => {
  // Reset position
  animatedValue.setValue(0);
  translateX.setValue(0);
  translateY.setValue(0);
  opacity.setValue(0);

  // Start animation with smooth easing
  Animated.timing(animatedValue, {
    toValue: 1,
    duration: 600,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  }).start();
};

type OutputType = {
  primary: string[] | number[];
  secondary: string[] | number[];
};

export const outputRotation: OutputType = {
  primary: ["0deg", "-20deg"],
  secondary: ["0deg", "20deg"],
};

export const outputScale: OutputType = {
  primary: [1, 0.9],
  secondary: [1, 0.9],
};

export const outputTranslateY: OutputType = {
  primary: [1, 20],
  secondary: [1, -50],
};
