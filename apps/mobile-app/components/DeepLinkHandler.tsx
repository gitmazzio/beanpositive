import { useCallback, useEffect } from "react";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useAuth } from "@/providers";
import usePocketContext from "@/hooks/usePocketContext";
import { usePendingDeepLink } from "@/contexts/PendingDeepLinkContext";
import { isAddHitUrl } from "@/constants/deepLinks";

/**
 * Gestisce addHit nelle tab autenticate: consuma pending (cold start) e ascolta
 * gli URL in tempo reale. Unica azione concreta: addNewHint + navigazione a tabs.
 */
export default function DeepLinkHandler() {
  const { user } = useAuth();
  const { addNewHint } = usePocketContext();
  const { consumePendingAction } = usePendingDeepLink();

  const executeAddHit = useCallback(() => {
    if (!user) return;
    addNewHint();
    router.push("/(authenticated)/(tabs)");
  }, [user, addNewHint]);

  useEffect(() => {
    const pending = consumePendingAction();
    if (pending === "addHit" && user) {
      executeAddHit();
    }

    const subscription = Linking.addEventListener("url", (event) => {
      if (!isAddHitUrl(event.url)) return;
      if (user) {
        executeAddHit();
      }
    });

    return () => subscription.remove();
  }, [user, executeAddHit, consumePendingAction]);

  return null;
}
