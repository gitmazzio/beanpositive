import { supabase } from "@/services/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddHit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { address: string; location?: any }) => {
      const { error } = await supabase.from("bean-hits").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate and refetch hits after a successful insert
      queryClient.invalidateQueries({ queryKey: ["hits"] });
    },
  });
};
