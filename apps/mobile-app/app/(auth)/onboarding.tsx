import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Un fagiolo per ogni momento felice",
    subtitle: "Tratto dal libro di Alois Burkhard",
    // image: require("./assets/onboarding1.png"), // Replace with your image path
    backgroundColor: "#F5F1E8",
    gradientColors: ["#E5E5E5", "#D0D0D0"],
  },
  {
    id: 2,
    title: "Scopri nuovi sapori ogni giorno",
    subtitle: "Ricette autentiche dalla tradizione",
    // image: require("./assets/onboarding2.png"), // Replace with your image path
    backgroundColor: "#F0F8F5",
    gradientColors: ["#D5E8D4", "#B8D4B8"],
  },
  {
    id: 3,
    title: "Condividi la gioia del buon cibo",
    subtitle: "Crea momenti speciali con chi ami",
    // image: require("./assets/onboarding3.png"), // Replace with your image path
    backgroundColor: "#FFF8F0",
    gradientColors: ["#F4E4C1", "#E8D5A3"],
  },
];

export default function OnboardingScreen({ onFinish }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar when step changes
    // const targetProgress = (currentStep + 1) / onboardingData.length;

    let targetProgress = 0.2;

    if (currentStep == 1) {
      targetProgress = 0.5;
    } else if (currentStep == 2) {
      targetProgress = 0.95;
    }

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
      router.push("/(auth)/login"); // Replace with your target route
      onFinish();
    }
  };

  const handleSkip = () => {
    // Skip to main app
    router.push("/(auth)/login"); // Replace with your target route
    onFinish();
  };

  const handleLogin = () => {
    // Navigate to login screen
    router.push("/(auth)/login"); // Replace with your login route
    onFinish();
  };

  const currentData = onboardingData[currentStep];
  const isLastStep = currentStep === onboardingData.length - 1;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentData.backgroundColor },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={currentData.backgroundColor}
      />

      {/* Header with skip button */}
      <View style={styles.header}>
        <View style={styles.headerButton}>
          {currentStep > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
        </View>
        {/* Progress bar */}
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
        <View style={styles.headerButton}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Salta</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{currentData.title}</Text>

        {/* Image */}
        <View style={styles.imageContainer}>
          {/* Replace this with actual Image component when you have the images */}
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{currentData.subtitle}</Text>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Login link - only show on first step */}
        {currentStep === 0 && (
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Hai già un account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Accedi subito</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {isLastStep ? "Inizia" : "Continua"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButton: {
    width: 70,
  },
  backButton: {
    width: 20,
    height: 20,
  },
  backText: {
    fontSize: 16,
    color: "#8B7355",
    fontWeight: "500",
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  progressBarBackground: {
    width: 120,
    height: 4,
    backgroundColor: "#D0D0D0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#8B7355",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#2C2C2C",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 40,
    fontFamily: "System",
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    maxWidth: 300,
    maxHeight: 300,
    marginBottom: 30,
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
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontWeight: "400",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
