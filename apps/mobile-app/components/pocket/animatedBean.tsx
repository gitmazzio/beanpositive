import { useEffect } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const BeanShape = ({ width = 200 }) => {
  return (
    <Svg width={width} height={width} viewBox="0 0 512 512">
      <Path
        d="M79.1113 235.724C120.04 235.507 153.162 202.031 152.945 161.103C152.91 154.511 158.244 149.118 164.837 149.083C205.766 148.866 238.888 115.39 238.67 74.4617C238.453 33.5321 204.977 0.411085 164.048 0.628444C75.5977 1.09818 4.01987 73.4404 4.4896 161.891C4.70696 202.82 38.1826 235.942 79.1113 235.724Z"
        fill="#cc7748"
      />
    </Svg>
  );
};
export const AnimatedBean = ({
  animatedValue,
  translateX,
  translateY,
  opacity,
}: {
  animatedValue: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  opacity: Animated.Value;
}) => {
  const calculateOpacity = (progress) => {
    if (progress <= 0.05) {
      // Da 0% a 5%: opacity da 0 a 1
      return progress / 0.05;
    } else if (progress <= 0.95) {
      // Da 5% a 95%: opacity rimane 1
      return 1;
    } else {
      // Da 95% a 100%: opacity da 1 a 0
      return 1 - (progress - 0.95) / 0.05;
    }
  };

  const calculateBezierPath = (progress) => {
    // Punti di partenza e arrivo
    const startX = 50; // Parte da destra
    const endX = -90; // Arriva a sinistra
    const startY = -100; // Parte dall'alto.
    const endY = -40; // Arriva in basso

    // Punti di controllo per una curva leggera
    const controlX1 = startX - (startX - endX) * 0.3; // Primo punto di controllo X
    const controlY1 = startY - 200;
    const controlX2 = startX - (startX - endX) * 1.5; // Secondo punto di controllo X
    const controlY2 = endY - 100; // Secondo punto di controllo Y (leggera curva verso l'alto)

    // Calcolo curva Bezier cubica
    const t = progress;
    const oneMinusT = 1 - t;

    // Formula curva Bezier cubica: P(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
    const x =
      Math.pow(oneMinusT, 3) * startX +
      3 * Math.pow(oneMinusT, 2) * t * controlX1 +
      3 * oneMinusT * Math.pow(t, 2) * controlX2 +
      Math.pow(t, 3) * endX;

    const y =
      Math.pow(oneMinusT, 3) * startY +
      3 * Math.pow(oneMinusT, 2) * t * controlY1 +
      3 * oneMinusT * Math.pow(t, 2) * controlY2 +
      Math.pow(t, 3) * endY;

    return { x, y };
  };

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      const { x, y } = calculateBezierPath(value);
      const opacityValue = calculateOpacity(value);

      translateX.setValue(x);
      translateY.setValue(y);
      opacity.setValue(opacityValue);
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Dot animation */}
      <Animated.View
        style={[
          styles.dot,
          {
            transform: [{ translateX }, { translateY }],
            opacity,
          },
        ]}
      >
        <BeanShape width={50} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 100,
  },
  dot: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controls: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  curveButton: {
    backgroundColor: "#666",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  button: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
