import {
  animationPrimaryPocket,
  animationSecondaryPocket,
  beanAnimation,
} from "@/components/pocket/animations";
import { useAuth } from "@/providers";
import { useAddHit } from "@/queries/mutations/useAddHit";
import { createContext, useCallback, useMemo, useRef } from "react";
import { Animated } from "react-native";
import Toast from "react-native-toast-message";

// Context per comunicare con Pocket
export type PocketContextType = {
  triggerMutation: () => void;
  rotationPrimaryAnim: Animated.Value;
  scalePrimaryAnim: Animated.Value;
  movePrimaryAnim: Animated.Value;
  rotationSecondaryAnim: Animated.Value;
  scaleSecondaryAnim: Animated.Value;
  moveSecondaryAnim: Animated.Value;
  animatedBeanValue: Animated.Value;
  translateBeanX: Animated.Value;
  translateBeanY: Animated.Value;
  opacityBean: Animated.Value;
  isLoadingMutation: boolean;
};

export const PocketContext = createContext<PocketContextType | undefined>(
  undefined
);

interface PocketProviderProps {
  children: React.ReactNode;
}

export const PocketProvider: React.FC<PocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const rotationPrimaryAnim = useRef(new Animated.Value(0)).current;
  const scalePrimaryAnim = useRef(new Animated.Value(0)).current;
  const movePrimaryAnim = useRef(new Animated.Value(0)).current;
  const rotationSecondaryAnim = useRef(new Animated.Value(0)).current;
  const scaleSecondaryAnim = useRef(new Animated.Value(0)).current;
  const moveSecondaryAnim = useRef(new Animated.Value(0)).current;
  // bean values
  const animatedBeanValue = useRef(new Animated.Value(0)).current;
  const translateBeanX = useRef(new Animated.Value(0)).current;
  const translateBeanY = useRef(new Animated.Value(0)).current;
  const opacityBean = useRef(new Animated.Value(0)).current;

  const { mutate: addHit, status } = useAddHit();

  const handleAddRow = useCallback(async () => {
    if (!user) {
      return;
    }
    animationPrimaryPocket({
      rotation: rotationPrimaryAnim,
      scale: scalePrimaryAnim,
      move: movePrimaryAnim,
    });
    animationSecondaryPocket({
      rotation: rotationSecondaryAnim,
      scale: scaleSecondaryAnim,
      move: moveSecondaryAnim,
    });
    beanAnimation({
      animatedValue: animatedBeanValue,
      translateX: translateBeanX,
      translateY: translateBeanY,
      opacity: opacityBean,
    });
    try {
      await addHit({ address: "Via Monte Napoleone" });

      Toast.show({
        type: "hintSuccess",
        text1: "Hai aggiunto un fagiolo. Grande!",
        position: "bottom",
        visibilityTime: 2000,
      });
    } catch (err: any) {
      // alert("Error: " + err.message);
    }
  }, [user]);

  const contextValue: PocketContextType = useMemo(
    () => ({
      triggerMutation: handleAddRow,
      rotationPrimaryAnim,
      scalePrimaryAnim,
      movePrimaryAnim,
      rotationSecondaryAnim,
      scaleSecondaryAnim,
      moveSecondaryAnim,
      animatedBeanValue,
      translateBeanX,
      translateBeanY,
      opacityBean,
      isLoadingMutation: status === "pending",
    }),
    [status]
  );

  return (
    <PocketContext.Provider value={contextValue}>
      {children}
    </PocketContext.Provider>
  );
};
