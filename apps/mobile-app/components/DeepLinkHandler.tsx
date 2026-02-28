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
  const {
    consumePendingAction,
    pendingAction,
  } = usePendingDeepLink();

  const executeAddHit = useCallback(() => {
    if (!user) return;
    addNewHint();
    router.push("/(authenticated)/(tabs)");
  }, [user, addNewHint]);

  useEffect(() => {
    if (!user) return;

    const pending = consumePendingAction();
    const shouldExecute = pending === "addHit" || pendingAction === "addHit";
    if (shouldExecute) {
      executeAddHit();
    }

    const subscription = Linking.addEventListener("url", (event) => {
      if (!isAddHitUrl(event.url)) return;
      if (user) {
        executeAddHit();
      }
    });

    return () => subscription.remove();
  }, [user, executeAddHit, consumePendingAction, pendingAction]);

  return null;
}
