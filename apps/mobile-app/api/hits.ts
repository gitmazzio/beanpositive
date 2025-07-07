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
  console.log("LOG hit", data);
  const { data: rowData, error } = await supabase
    .from("bean-hits")
    .insert([data])
    .select();

  console.log("LOG", error, rowData);
  if (error) throw error;
};

export const getHitsByDate = async (user_id: string, day: Date) => {
  const { data: rowData, error } = await supabase
    .from("bean-hits")
    .select()
    .eq("user_id", user_id);

  console.log("LOG", error, rowData);
  if (error) throw error;
};
