import {
  animationPrimaryPocket,
  animationSecondaryPocket,
  beanAnimation,
} from "@/components/pocket/animations"
import { useAuth } from "@/providers"
import { useAddHit } from "@/queries/mutations/useAddHit"
import { useLocation } from "@/hooks/useLocation"
import { createContext, useCallback, useMemo, useRef, useState } from "react"
import { Animated } from "react-native"
import Toast from "react-native-toast-message"

// Context per comunicare con Pocket
export type PocketContextType = {
  addNewHint: () => void
  isCameraVisible: boolean
  openCamera: () => void
  closeCamera: () => void
  onCameraSuccess: () => void
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
  const [isCameraVisible, setIsCameraVisible] = useState(false)

  /**
   * Apre la camera per scattare una foto
   */
  const openCamera = useCallback(() => {
    if (!user) {
      return
    }
    setIsCameraVisible(true)
  }, [user])

  /**
   * Chiude la camera
   */
  const closeCamera = useCallback(() => {
    setIsCameraVisible(false)
  }, [])

  /**
   * Gestisce il successo della creazione hit dalla camera
   * Esegue le animazioni e invalida le query
   */
  const handleCameraSuccess = useCallback(() => {
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
  }, [
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
  ])

  /**
   * Handler principale per aggiungere un hit
   * Ora apre la camera invece di creare direttamente l'hit
   */
  const handleAddRow = useCallback(() => {
    if (!user) {
      return
    }
    openCamera()
  }, [user, openCamera])

  const contextValue: PocketContextType = useMemo(
    () => ({
      addNewHint: handleAddRow,
      isCameraVisible,
      openCamera,
      closeCamera,
      onCameraSuccess: handleCameraSuccess,
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
    [
      handleAddRow,
      isCameraVisible,
      openCamera,
      closeCamera,
      handleCameraSuccess,
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
      status,
    ]
  )

  return (
    <PocketContext.Provider value={contextValue}>
      {children}
    </PocketContext.Provider>
  )
}
