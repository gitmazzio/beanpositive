import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/services/supabase"
import { startOfMonth, endOfMonth } from "date-fns"

export function useUserHitsByMonth(
  userId?: string,
  year?: number,
  month?: number
) {
  return useQuery({
    queryKey: ["hits", userId, year, month],
    queryFn: async () => {
      if (!userId || !year || !month) return []

      // Create date in UTC to avoid timezone conversion issues
      const monthDate = new Date(Date.UTC(year, month - 1, 1))

      // Get start and end of month
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)

      // Set time to start and end of day in UTC
      start.setUTCHours(0, 0, 0, 0)
      end.setUTCHours(23, 59, 59, 999)

      // Convert to ISO strings (already in UTC)
      const startDate = start.toISOString()
      const endDate = end.toISOString()

      const { data, error } = await supabase
        .from("bean-hits")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!userId && !!year && !!month,
  })
}
