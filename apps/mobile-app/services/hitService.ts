import { supabase } from "./supabase";

/**
 * Upload di un'immagine su Supabase Storage e creazione di un hit
 * 
 * @param imageUri - URI locale dell'immagine (es. file://...)
 * @param userId - ID dell'utente
 * @param address - Indirizzo opzionale
 * @param location - Coordinate opzionali
 * @returns URL pubblico dell'immagine caricata
 */
export const uploadHitImage = async (
  imageUri: string,
  userId: string,
  address?: string,
  location?: { lat: number; lng: number }
): Promise<string> => {
  try {
    // Genera un nome file univoco
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `${userId}/${timestamp}-${randomId}.jpg`;
    const filePath = `hits/${fileName}`;

    // Leggi il file come blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload su Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("hit-images") // Bucket name - assicurati che esista su Supabase
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: false, // Non sovrascrivere file esistenti
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Ottieni l'URL pubblico dell'immagine
    const {
      data: { publicUrl },
    } = supabase.storage.from("hit-images").getPublicUrl(filePath);

    if (!publicUrl) {
      throw new Error("Failed to get public URL");
    }

    // Crea il record hit nel database
    const hitPayload: {
      image_url: string;
      address?: string;
      location?: { lat: number; lng: number };
    } = {
      image_url: publicUrl,
    };

    if (address) {
      hitPayload.address = address;
    }

    if (location) {
      hitPayload.location = location;
    }

    const { error: dbError } = await supabase
      .from("bean-hits")
      .insert([hitPayload]);

    if (dbError) {
      // Se il DB fallisce, prova a eliminare l'immagine caricata
      await supabase.storage.from("hit-images").remove([filePath]);
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadHitImage:", error);
    throw error;
  }
};
