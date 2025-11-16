import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

export function useUserHitsByMonth(
  userId?: string,
  year?: number,
  month?: number
) {
  return useQuery({
    queryKey: ["hits", userId, year, month],
    queryFn: async () => {
      if (!userId || !year || !month) return [];

      // Create start and end dates for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const { data, error } = await supabase
        .from("bean-hits")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId && !!year && !!month,
  });
}
