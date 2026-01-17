import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

export type HapticsImpactStyle = Haptics.ImpactFeedbackStyle;
export type HapticsNotificationStyle = Haptics.NotificationFeedbackType;
export type HapticsAndroidType = Haptics.AndroidHaptics;

/**
 * Haptics usage patterns:
 * - Confirm actions: triggerConfirmHaptic()
 * - Toggles/checkboxes: triggerSelectionHaptic()
 * - Errors: triggerErrorHaptic()
 *
 * Examples:
 * const handleSave = async () => {
 *   await triggerConfirmHaptic();
 * };
 *
 * const handleToggle = async () => {
 *   await triggerSelectionHaptic();
 * };
 *
 * const handleError = async () => {
 *   await triggerErrorHaptic();
 * };
 */

const HAPTICS_ENABLED_KEY = "hapticsEnabled";
const HAPTICS_DEBOUNCE_MS = 120;

let cachedHapticsEnabled: boolean | null = null;
let lastHapticAt = 0;

export const getHapticsEnabled = async () => {
  if (cachedHapticsEnabled != null) {
    return cachedHapticsEnabled;
  }

  try {
    const storedValue = await AsyncStorage.getItem(HAPTICS_ENABLED_KEY);
    cachedHapticsEnabled = storedValue !== "false";
    return cachedHapticsEnabled;
  } catch {
    return true;
  }
};

export const setHapticsEnabled = async (enabled: boolean) => {
  cachedHapticsEnabled = enabled;
  try {
    await AsyncStorage.setItem(
      HAPTICS_ENABLED_KEY,
      enabled ? "true" : "false"
    );
  } catch {
    // Ignore storage failures
  }
};

const runHaptic = async (action: () => Promise<void>) => {
  const isEnabled = await getHapticsEnabled();
  if (!isEnabled) {
    return;
  }

  const now = Date.now();
  if (now - lastHapticAt < HAPTICS_DEBOUNCE_MS) {
    return;
  }

  lastHapticAt = now;

  try {
    await action();
  } catch {
    // Ignore failures (e.g. unsupported device or permission constraints)
  }
};

export const triggerSelectionHaptic = async () => {
  await runHaptic(() => Haptics.selectionAsync());
};

export const triggerImpactHaptic = async (
  style: HapticsImpactStyle = Haptics.ImpactFeedbackStyle.Medium
) => {
  await runHaptic(() => Haptics.impactAsync(style));
};

export const triggerNotificationHaptic = async (
  type: HapticsNotificationStyle = Haptics.NotificationFeedbackType.Success
) => {
  await runHaptic(() => Haptics.notificationAsync(type));
};

export const triggerAndroidHaptic = async (type: HapticsAndroidType) => {
  if (Platform.OS !== "android") {
    return;
  }

  await runHaptic(() => Haptics.performAndroidHapticsAsync(type));
};

export const triggerConfirmHaptic = async () => {
  if (Platform.OS === "android") {
    await runHaptic(() =>
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)
    );
    return;
  }

  await runHaptic(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  );
};

export const triggerErrorHaptic = async () => {
  await runHaptic(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  );
};
