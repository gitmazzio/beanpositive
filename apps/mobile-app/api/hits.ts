import { useAuth } from "@/providers";
import { supabase } from "@/services/supabase";

type Props = {
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
};

export const getHitsByDate = async (user_id: string, day: Date) => {
  const { data: rowData, error } = await supabase
    .from("bean-hits")
    .select()
    .eq("user_id", user_id);

  if (error) throw error;
};
