import { supabase } from "@/services/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface AddHitPayload {
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export const useAddHit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddHitPayload) => {
      const { error } = await supabase.from("bean-hits").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate and refetch hits after a successful insert
      queryClient.invalidateQueries({ queryKey: ["hits"] });
    },
  });
};
