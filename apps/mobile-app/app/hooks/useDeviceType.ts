import { useMemo } from "react";
import { Dimensions, Platform } from "react-native";

type DeviceType =
  | "iphone-se"
  | "iphone-x-or-bigger"
  | "other-iphone"
  | "android-small"
  | "android-large"
  | "other-android"
  | "other";

interface UseDeviceTypeResult {
  isIPhone: boolean;
  isAndroid: boolean;
  isIPhoneSE: boolean;
  isIPhoneXOrBigger: boolean;
  isOtherIPhone: boolean;
  isAndroidSmall: boolean;
  isAndroidLarge: boolean;
  isOtherAndroid: boolean;
  isOtherDevice: boolean;
  deviceType: DeviceType;
}

// Altezza logica (portrait)
const IPHONE_X_HEIGHTS = [812, 844, 852, 896, 926, 932];
const IPHONE_SE_HEIGHTS = [568, 667];

function useDeviceType(): UseDeviceTypeResult {
  const { height, width } = Dimensions.get("window");
  const h = Math.max(height, width); // per coprire portrait e landscape

  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  const isIPhone = isIOS && !Platform.isPad && !Platform.isTV;

  const deviceType: DeviceType = useMemo(() => {
    if (isIPhone) {
      if (IPHONE_SE_HEIGHTS.includes(h)) return "iphone-se";
      if (IPHONE_X_HEIGHTS.includes(h) || h >= 812) return "iphone-x-or-bigger";
      return "other-iphone";
    }

    if (isAndroid) {
      if (h < 640) return "android-small";
      if (h >= 800) return "android-large";
      return "other-android";
    }

    return "other";
  }, [h, isIPhone, isAndroid]);

  return {
    isIPhone,
    isAndroid,
    isIPhoneSE: deviceType === "iphone-se",
    isIPhoneXOrBigger: deviceType === "iphone-x-or-bigger",
    isOtherIPhone: deviceType === "other-iphone",
    isAndroidSmall: deviceType === "android-small",
    isAndroidLarge: deviceType === "android-large",
    isOtherAndroid: deviceType === "other-android",
    isOtherDevice: deviceType === "other",
    deviceType,
  };
}

export default useDeviceType;
