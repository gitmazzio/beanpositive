import { Header } from "@/components/authenticated/Header"
import Calendar from "@/components/commons/Calendar"
import DayDetails from "@/components/commons/DayDetails"
import { PageView } from "@/components/Themed"
import { useAuth } from "@/providers"
import { useUserHitsByMonth } from "@/queries/mutations/useUserHitsByMonth"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"

export default function TabTwoScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const { data: hits = [], isLoading } = useUserHitsByMonth(
    user?.id,
    currentYear,
    currentMonth
  )

  const handleDayPress = (date: Date) => {
    // Create a new date in local timezone to avoid timezone issues
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
    setSelectedDate(localDate)
  }

  useEffect(() => {
    handleDayPress(new Date())
  }, [])

  return (
    <PageView style={styles.container}>
      <Header />

      <Calendar
        onDayPress={handleDayPress}
        selectedDate={selectedDate ?? undefined}
        hits={hits}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEnabled={true}
      >
        <DayDetails
          selectedDate={selectedDate}
          hits={hits}
          isLoading={isLoading}
        />
      </ScrollView>
    </PageView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
})
