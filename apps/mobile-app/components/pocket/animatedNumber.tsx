import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import StyledText from "../commons/StyledText";

type Props = {
  number: number;
};

export const AnimatedNumber = ({ number }: Props) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Resetta l'animazione ogni volta che il numero cambia
    translateY.setValue(-100);
    opacity.setValue(0);
    scale.setValue(0.8);

    // Avvia l'animazione con effetto rimbalzo
    Animated.sequence([
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [number]);

  return (
    <View style={styles.container}>
      <View style={styles.numberContainer}>
        {number !== 0 ? (
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                transform: [{ translateY }, { scale }],
                opacity,
              },
            ]}
          >
            <StyledText kind="h1" style={styles.numberText}>
              {number}
            </StyledText>
          </Animated.View>
        ) : null}
      </View>
      <StyledText kind="h1" style={styles.descriptionText} textAlign="center">
        {number === 0 ? "Nessun fagiolo\nconservato" : "fagioli\nconservati"}
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  numberContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  animatedContainer: {
    position: "absolute",
  },
  numberText: {
    fontSize: 92,
    color: "#333",
  },
  descriptionText: {
    fontSize: 24,
    color: "#333",
  },
});
