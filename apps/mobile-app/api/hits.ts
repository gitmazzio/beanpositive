import { useAuth } from "@/providers";
import { supabase } from "@/services/supabase";

type Props = {
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
};

export const addTestRow = async (data: Props) => {
  const { data: rowData, error } = await supabase
    .from("bean-hits")
    .insert([data])
    .select();

  if (error) throw error;
};

export const getHitsByDate = async (user_id: string, day: Date) => {
  const { data: rowData, error } = await supabase
    .from("bean-hits")
    .select()
    .eq("user_id", user_id);

  if (error) throw error;
};
