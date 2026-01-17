import { useEffect, useState } from "react";
import { getHapticsEnabled, setHapticsEnabled } from "@/utils/haptics";

type UseHapticsPreferenceReturn = {
  isEnabled: boolean | null;
  isLoading: boolean;
  setEnabled: (enabled: boolean) => Promise<void>;
};

export const useHapticsPreference = (): UseHapticsPreferenceReturn => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const enabled = await getHapticsEnabled();
      if (!isMounted) {
        return;
      }

      setIsEnabled(enabled);
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSetEnabled = async (enabled: boolean) => {
    setIsEnabled(enabled);
    await setHapticsEnabled(enabled);
  };

  return {
    isEnabled,
    isLoading,
    setEnabled: handleSetEnabled,
  };
};
