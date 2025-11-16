import { useState, useEffect } from "react";
import { oneSignalService, NotificationData } from "../services/onesignal";

export interface UseNotificationsReturn {
  hasPermission: boolean | null;
  deviceId: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  setUserTag: (key: string, value: string) => Promise<void>;
  setUserTags: (tags: Record<string, string>) => Promise<void>;
  promptForNotifications: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
    getDeviceId();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const permission = await oneSignalService.areNotificationsEnabled();
      setHasPermission(permission);
    } catch (error) {
      console.error("Error checking permission status:", error);
    }
  };

  const getDeviceId = async () => {
    try {
      const id = await oneSignalService.getDeviceId();
      setDeviceId(id);
    } catch (error) {
      console.error("Error getting device ID:", error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const granted = await oneSignalService.requestPermissions();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setUserTag = async (key: string, value: string): Promise<void> => {
    try {
      await oneSignalService.setUserTag(key, value);
    } catch (error) {
      console.error("Error setting user tag:", error);
    }
  };

  const setUserTags = async (tags: Record<string, string>): Promise<void> => {
    try {
      await oneSignalService.setUserTags(tags);
    } catch (error) {
      console.error("Error setting user tags:", error);
    }
  };

  const promptForNotifications = async (): Promise<void> => {
    try {
      await oneSignalService.promptForNotifications();
    } catch (error) {
      console.error("Error prompting for notifications:", error);
    }
  };

  return {
    hasPermission,
    deviceId,
    isLoading,
    requestPermission,
    setUserTag,
    setUserTags,
    promptForNotifications,
  };
};
