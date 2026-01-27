import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useAuth } from "@/providers";
import usePocketContext from "@/app/hooks/usePocketContext";
import { router } from "expo-router";

export default function DeepLinkHandler() {
  const { user } = useAuth();
  const { addNewHint } = usePocketContext();

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      try {
        console.log("🔗 Deep link ricevuto:", url);

        // Verifica se è il deep link per aggiungere un hit
        if (url === "beanpositive://addHit" || url.includes("beanpositive://addHit")) {
          // Verifica che l'utente sia autenticato
          if (!user) {
            console.log("⚠️ Utente non autenticato, navigo al login");
            router.push("/(not_authenticated)/login");
            return;
          }

          console.log("✅ Eseguo addHit dal widget");
          // Chiama addNewHint che gestisce l'aggiunta del fagiolo
          addNewHint();

          // Naviga alla schermata principale se non ci siamo già
          router.push("/(authenticated)/(tabs)");
        }
      } catch (error) {
        console.error("❌ Errore nella gestione del deep link:", error);
      }
    };

    // Gestisci il deep link quando l'app viene aperta
    const checkInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await handleDeepLink(initialUrl);
        }
      } catch (error) {
        console.error("Errore nel controllo dell'URL iniziale:", error);
      }
    };

    // Gestisci i deep link quando l'app è già aperta
    const subscription = Linking.addEventListener("url", async (event) => {
      await handleDeepLink(event.url);
    });

    checkInitialUrl();

    return () => {
      subscription.remove();
    };
  }, [user, addNewHint]);

  return null;
}
