import { Button } from "@/components/commons/Button";
import Flex from "@/components/commons/Flex";
import { Header } from "@/components/commons/Header";
import Link from "@/components/commons/Link";
import StyledText from "@/components/commons/StyledText";
import { PageView } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Un fagiolo per ogni\nmomento felice",
    subtitle: "Tratto dal libro di Alois Burkhard",
    image: require("./../assets/images/onboarding1.png"), // Replace with your image path
  },
  {
    id: 2,
    title: "La tasca destra\ndel duca",
    subtitle:
      "C’era una volta un duca che, ogni mattina, metteva una manciata di fagioli nella tasca destra. Non per mangiarli, ma per qualcosa di molto più prezioso...",
    image: require("./../assets/images/onboarding2.png"), // Replace with your image path
  },
  {
    id: 3,
    title: "Ogni momento conta",
    subtitle:
      "Ogni volta che qualcosa di bello accadeva (un sorriso, un buon pasto, una parola gentile)...faceva passare un fagiolo nella tasca sinistra.",
    image: require("./../assets/images/onboarding3.png"), // Replace with your image path
  },
  {
    id: 4,
    title: "Bean Positive\nè la tua tasca sinistra",
    subtitle:
      "Contando i fagioli nella tasca sinistra, ricordava tutto ciò che aveva reso quel giorno degno di essere vissuto.",
    extraSubtitle: "Con Bean Positive, anche tu\npuoi fare lo stesso.",
    image: require("./../assets/images/onboarding4.png"), // Replace with your image path
  },
];

export default function OnboardingScreen({ onFinish }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const progressAnimation = useRef(new Animated.Value(0)).current;

  const handleOnboardingFinish = useCallback(async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
  }, []);

  useEffect(() => {
    // Animate progress bar when step changes
    const progressSteps = [0.2, 0.5, 0.7, 0.95];
    const targetProgress = progressSteps[currentStep];

    Animated.timing(progressAnimation, {
      toValue: targetProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinue = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to main app
      router.push("/(not_authenticated)/login"); // Replace with your target route
      handleOnboardingFinish?.();
    }
  };

  const handleSkip = () => {
    // Skip to main app
    router.push("/(not_authenticated)/login"); // Replace with your target route
    handleOnboardingFinish?.();
  };

  const handleLogin = () => {
    // Navigate to login screen
    router.push("/(not_authenticated)/login"); // Replace with your login route
    handleOnboardingFinish?.();
  };

  const currentData = onboardingData[currentStep];
  const isLastStep = currentStep === onboardingData.length - 1;

  return (
    <PageView>
      <Header
        withBack={currentStep > 0}
        onPressBack={handleBack}
        leftChildren={
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Salta</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </Header>

      {/* Main content */}
      <Flex
        direction="column"
        align="center"
        justify="flex-start"
        style={[styles.content]}
      >
        <Flex style={{ height: 70 }} align="center" justify="center">
          <StyledText kind="h1" textAlign="center">
            {currentData.title}
          </StyledText>
        </Flex>

        <View style={styles.imageContainer}>
          <Image source={currentData.image} style={styles.image} />
        </View>

        {currentData.subtitle != null && (
          <StyledText kind="body" textAlign="center">
            {currentData.subtitle}
          </StyledText>
        )}

        {currentData.extraSubtitle != null && (
          <StyledText
            kind="body"
            textAlign="center"
            style={{
              fontWeight: 700,
              color: "#381110",
              marginTop: 4,
            }}
          >
            {currentData.extraSubtitle}
          </StyledText>
        )}
      </Flex>

      <View>
        {currentStep === 0 && (
          <Flex
            gap={4}
            align="center"
            justify="center"
            style={styles.loginContainer}
          >
            <StyledText kind="body">Hai già un account?</StyledText>
            <Link onPress={handleLogin}>Accedi subito</Link>
          </Flex>
        )}
        <Button
          title={
            currentStep === 0
              ? "Leggi la storia"
              : isLastStep
                ? "Inizia ora"
                : "Continua"
          }
          kind={isLastStep ? "primary" : "tertiary"}
          onPress={handleContinue}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  skipText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  progressContainer: {
    flex: 2,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  progressBarBackground: {
    width: 120,
    height: 4,
    backgroundColor: "#C8CEB0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#404B35",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    marginTop: 8,
  },
  imageContainer: {
    maxWidth: 300,
    maxHeight: 300,
    marginBottom: 12,
    marginTop: 12,
  },
  imagePlaceholder: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  image: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 20,
  },
  loginContainer: {
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "400",
  },
  loginLink: {
    fontSize: 16,
    color: "#2C2C2C",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2C2C2C",
    textAlign: "center",
  },
  stepIndicator: {
    alignItems: "center",
    marginBottom: 15,
  },
  stepText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "400",
  },
  bottomIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#2C2C2C",
    borderRadius: 2,
    alignSelf: "center",
  },
});
