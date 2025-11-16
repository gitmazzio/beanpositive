import { Animated, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import StyledText from "../commons/StyledText";
import { AnimatedNumber } from "./animatedNumber";
import { outputRotation, outputScale, outputTranslateY } from "./animations";
import BeansMapGeneration from "./BeansMapGeneration";

type Props = {
  width?: number;
  height?: number;
  color?: string;
  tabText?: string;
  mainText?: string;
  tabColor?: string;
  tabTextColor?: string;
  scale?: number;
  animatedRotation?: Animated.Value;
  animatedScale?: Animated.Value;
  animatedMove?: Animated.Value;
  style?: ViewStyle;
  pocketId: "primary" | "secondary"; // Use 'primary' or 'secondary' to differentiate animations
  withNumber?: boolean;
  hintNumber?: number; // Optional prop to pass a number for the animated number component
  borderColor?: string; // Optional prop for border color
};

export const Pocket = ({
  width = 303,
  height = 338,
  color = "#C8CEB0",
  tabText = "Tasca sinistra",
  tabColor = "#E7EAD7",
  tabTextColor = "#5A6B4A",
  mainText = "Nessun fagiolo\nconservato",
  borderColor = "#A0A892",
  scale = 1,
  animatedRotation = new Animated.Value(0),
  animatedScale = new Animated.Value(0),
  animatedMove = new Animated.Value(0),
  style,
  pocketId = "primary", // Use 'primary' or 'secondary' to differentiate animations
  withNumber = false, // New prop to conditionally render the number
  hintNumber = 0, // Default value for the number
}: Props) => {
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Exact SVG path from your provided SVG
  const shieldPath = `
    M168.419 333.811L288.453 270.608C297.399 265.897 303 256.619 303 246.508V45.7944V27.236C303 12.194 290.806 0 275.764 0H27.236C12.194 0 0 12.194 0 27.236V45.7944V246.508C0 256.619 5.60058 265.897 14.5467 270.608L134.581 333.811C145.171 339.387 157.829 339.387 168.419 333.811Z
  `;

  // Tab dimensions
  const tabWidth = 160 * scale;
  const tabHeight = 30 * scale;

  // Tab path (positioned above the shield)
  const tabPath = `
    M ${(scaledWidth - tabWidth) / 2 + 5} ${-tabHeight}
    L ${(scaledWidth + tabWidth) / 2 - 5} ${-tabHeight}
    Q ${(scaledWidth + tabWidth) / 2} ${-tabHeight} ${(scaledWidth + tabWidth) / 2} ${-tabHeight + 5}
    L ${(scaledWidth + tabWidth) / 2} ${-5}
    Q ${(scaledWidth + tabWidth) / 2} 0 ${(scaledWidth + tabWidth) / 2 - 5} 0
    L ${(scaledWidth - tabWidth) / 2 + 5} 0
    Q ${(scaledWidth - tabWidth) / 2} 0 ${(scaledWidth - tabWidth) / 2} ${-5}
    L ${(scaledWidth - tabWidth) / 2} ${-tabHeight + 5}
    Q ${(scaledWidth - tabWidth) / 2} ${-tabHeight} ${(scaledWidth - tabWidth) / 2 + 5} ${-tabHeight}
    Z
  `;

  // Dashed border path (slightly inset from the original shape)
  const borderInset = 25 * scale;
  const borderPath = `
    M ${157.531 * scale} ${(333.811 - borderInset) * scale}
    L ${(277.565 - borderInset) * scale} ${(270.608 - borderInset / 2) * scale}
    C ${(286.511 - borderInset) * scale} ${(265.897 - borderInset / 2) * scale} ${(303 - borderInset) * scale} ${(256.619 - borderInset) * scale} ${(303 - borderInset) * scale} ${(246.508 - borderInset) * scale}
    L ${(303 - borderInset) * scale} ${(45.7944 + borderInset) * scale}
    L ${(303 - borderInset) * scale} ${(27.236 + borderInset) * scale}
    C ${(303 - borderInset) * scale} ${(12.194 + borderInset) * scale} ${(290.806 - borderInset) * scale} ${borderInset * scale} ${(275.764 - borderInset) * scale} ${borderInset * scale}
    L ${(27.236 + borderInset) * scale} ${borderInset * scale}
    C ${(12.194 + borderInset) * scale} ${borderInset * scale} ${borderInset * scale} ${(12.194 + borderInset) * scale} ${borderInset * scale} ${(27.236 + borderInset) * scale}
    L ${borderInset * scale} ${(45.7944 + borderInset) * scale}
    L ${borderInset * scale} ${(246.508 - borderInset) * scale}
    C ${borderInset * scale} ${(256.619 - borderInset) * scale} ${(5.60058 + borderInset) * scale} ${(265.897 - borderInset / 2) * scale} ${(14.5467 + borderInset) * scale} ${(270.608 - borderInset / 2) * scale}
    L ${(134.581 + borderInset / 2) * scale} ${(333.811 - borderInset) * scale}
    C ${(145.171 + borderInset / 2) * scale} ${(339.387 - borderInset) * scale} ${(157.829 - borderInset / 2) * scale} ${(339.387 - borderInset) * scale} ${(168.419 - borderInset / 2) * scale} ${(333.811 - borderInset) * scale}
    Z
  `;

  // Convert rotation value to transform string
  const rotateTransform = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: outputRotation[pocketId],
  });

  const scaleTransform = animatedScale.interpolate({
    inputRange: [0, 1],
    outputRange: outputScale[pocketId],
  });

  const translateYTransform = animatedMove.interpolate({
    inputRange: [0, 1],
    outputRange: outputTranslateY[pocketId],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [
            { rotate: rotateTransform },
            { scale: scaleTransform },
            { translateY: translateYTransform },
          ],
        },
      ]}
    >
      <Svg
        width={scaledWidth}
        height={scaledHeight + tabHeight}
        viewBox={`0 0 ${scaledWidth} ${scaledHeight + tabHeight}`}
      >
        {/* Tab */}
        <Path
          d={tabPath}
          fill={tabColor}
          transform={`translate(0, ${tabHeight})`}
        />

        {/* Main shield - exact SVG path */}
        <Path
          d={shieldPath}
          fill={color}
          transform={`translate(0, ${tabHeight}) scale(${scale})`}
        />

        {/* Dashed border */}
        <Path
          d={borderPath}
          fill="none"
          stroke={borderColor}
          strokeWidth={3 * scale}
          strokeDasharray={`${15 * scale},${15 * scale}`}
          transform={`translate(0, ${tabHeight})`}
        />
      </Svg>

      {/* <BeansMapGeneration hints={hintNumber} /> */}

      {/* Tab text */}
      <StyledText
        kind="subtitle"
        style={[
          styles.tabText,
          {
            top: -2 * scale,
            fontSize: 18 * scale,
            width: tabWidth,
            color: tabTextColor,
          },
        ]}
      >
        {tabText}
      </StyledText>

      {/* Main text */}
      {withNumber ? (
        <Text
          style={[
            styles.mainText,
            {
              top: (tabHeight + 130) * scale,
            },
          ]}
        >
          <AnimatedNumber number={hintNumber} />
        </Text>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  spacing: {
    marginTop: 30,
  },
  tabText: {
    position: "absolute",
    textAlign: "center",
  },
  mainText: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "600",
    color: "#5A6B4A",
    textAlign: "center",
    lineHeight: 22,
  },
});
