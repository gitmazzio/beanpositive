import {
  animationPrimaryPocket,
  animationSecondaryPocket,
  beanAnimation,
} from "@/components/pocket/animations"
import { useAuth } from "@/providers"
import { useAddHit } from "@/queries/mutations/useAddHit"
import { useLocation } from "@/hooks/useLocation"
import { createContext, useCallback, useMemo, useRef } from "react"
import { Animated } from "react-native"
import Toast from "react-native-toast-message"

// Context per comunicare con Pocket
export type PocketContextType = {
  addNewHint: () => void
  rotationPrimaryAnim: Animated.Value
  scalePrimaryAnim: Animated.Value
  movePrimaryAnim: Animated.Value
  rotationSecondaryAnim: Animated.Value
  scaleSecondaryAnim: Animated.Value
  moveSecondaryAnim: Animated.Value
  animatedBeanValue: Animated.Value
  translateBeanX: Animated.Value
  translateBeanY: Animated.Value
  opacityBean: Animated.Value
  isLoadingMutation: boolean
}

export const PocketContext = createContext<PocketContextType | undefined>(
  undefined
)

interface PocketProviderProps {
  children: React.ReactNode
}

export default function PocketProvider({ children }: PocketProviderProps) {
  const { user } = useAuth()
  const { getCurrentLocation, getAddressFromCoordinates } = useLocation()
  const rotationPrimaryAnim = useRef(new Animated.Value(0)).current
  const scalePrimaryAnim = useRef(new Animated.Value(0)).current
  const movePrimaryAnim = useRef(new Animated.Value(0)).current
  const rotationSecondaryAnim = useRef(new Animated.Value(0)).current
  const scaleSecondaryAnim = useRef(new Animated.Value(0)).current
  const moveSecondaryAnim = useRef(new Animated.Value(0)).current
  // bean values
  const animatedBeanValue = useRef(new Animated.Value(0)).current
  const translateBeanX = useRef(new Animated.Value(0)).current
  const translateBeanY = useRef(new Animated.Value(0)).current
  const opacityBean = useRef(new Animated.Value(0)).current

  const { mutate: addHit, status } = useAddHit()

  const handleAddRow = useCallback(async () => {
    if (!user) {
      return
    }
    animationPrimaryPocket({
      rotation: rotationPrimaryAnim,
      scale: scalePrimaryAnim,
      move: movePrimaryAnim,
    })
    animationSecondaryPocket({
      rotation: rotationSecondaryAnim,
      scale: scaleSecondaryAnim,
      move: moveSecondaryAnim,
    })
    beanAnimation({
      animatedValue: animatedBeanValue,
      translateX: translateBeanX,
      translateY: translateBeanY,
      opacity: opacityBean,
    })
    try {
      // Prova a ottenere la posizione corrente
      const location = await getCurrentLocation()
      let address: string | undefined
      let locationData: { lat: number; lng: number } | undefined

      if (location) {
        const { latitude, longitude } = location.coords
        locationData = { lat: latitude, lng: longitude }

        // Prova a ottenere l'indirizzo dalle coordinate
        const addressFromCoords = await getAddressFromCoordinates(
          latitude,
          longitude
        )
        address = addressFromCoords || undefined
      }

      // Se non abbiamo l'indirizzo, usa un valore di default
      if (!address) {
        address = "Posizione non disponibile"
      }

      await addHit({
        address,
        location: locationData,
      })

      Toast.show({
        type: "hintSuccess",
        text1: "Hai aggiunto un fagiolo. Grande!",
        position: "top",
        visibilityTime: 2000,
      })
    } catch (err: any) {
      console.error("Error adding hit:", err)
      // alert("Error: " + err.message);
    }
  }, [user, getCurrentLocation, getAddressFromCoordinates, addHit])

  const contextValue: PocketContextType = useMemo(
    () => ({
      addNewHint: handleAddRow,
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
    [handleAddRow, status]
  )

  return (
    <PocketContext.Provider value={contextValue}>
      {children}
    </PocketContext.Provider>
  )
}
