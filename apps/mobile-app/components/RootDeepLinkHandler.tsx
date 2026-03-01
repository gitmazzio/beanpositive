import { usePendingDeepLink } from "@/contexts/PendingDeepLinkContext";
import { isAddHitUrl } from "@/constants/deepLinks";
import { useAuth } from "@/providers";
import * as Linking from "expo-linking";
import { useEffect, useRef } from "react";

/**
 * Gestisce addHit in root (cold start + app già aperta).
 * +native-intent reindirizza già /addHit → login, quindi su cold start con !user
 * non serve navigare; basta impostare pending quando c'è l'utente.
 */
export default function RootDeepLinkHandler() {
  const { user, loading } = useAuth();
  const { setPendingAction } = usePendingDeepLink();
  const initialUrlProcessedRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (initialUrlProcessedRef.current) return;

    const processInitialUrl = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (!url || !isAddHitUrl(url)) {
          initialUrlProcessedRef.current = true;
          return;
        }

        if (user) {
          initialUrlProcessedRef.current = true;
          setPendingAction("addHit");
        }
        // !user: non marcare come processato, così riproviamo quando user fa login
      } catch (error) {
        console.error("Errore nel controllo dell'URL iniziale:", error);
        initialUrlProcessedRef.current = true;
      }
    };

    processInitialUrl();
  }, [loading, user, setPendingAction]);

  // useEffect(() => {
  //   const subscription = Linking.addEventListener("url", (event) => {
  //     if (!isAddHitUrl(event.url)) return;
  //     if (user) {
  //       setPendingAction("addHit");
  //     } else {
  //       router.push("/(not_authenticated)/login");
  //     }
  //   });
  //   return () => subscription.remove();
  // }, [user, setPendingAction]);

  return null;
}
