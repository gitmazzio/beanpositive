import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

export function useUserHitsByDay(userId?: string, date?: string) {
  // date should be in 'YYYY-MM-DD' format

  return useQuery({
    queryKey: ["hits", userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bean-hits")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", `${date}T00:00:00.000Z`)
        .lte("created_at", `${date}T23:59:59.999Z`);
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!date, // only run if both are provided
  });
}
