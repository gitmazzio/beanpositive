import { Header } from "@/components/authenticated/Header"
import Calendar from "@/components/commons/Calendar"
import DayDetails from "@/components/commons/DayDetails"
import { PageView } from "@/components/Themed"
import { useAuth } from "@/providers"
import { useUserHitsByMonth } from "@/queries/mutations/useUserHitsByMonth"
import { useMemo, useState } from "react"
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

  const accountCreationDate = user?.created_at
    ? new Date(user.created_at)
    : new Date()
  const minMonthDate = new Date(
    accountCreationDate.getFullYear(),
    accountCreationDate.getMonth(),
    1
  )
  const today = new Date()
  const todayMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const previousMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  )
  const nextMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  )

  const canGoPrevious = previousMonthDate >= minMonthDate
  const canGoNext = nextMonthDate <= todayMonthStart

  const handlePreviousMonth = () => {
    if (!canGoPrevious) {
      return
    }

    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
    setSelectedDate(null) // Reset selected date when changing month
  }

  const handleNextMonth = () => {
    if (!canGoNext) {
      return
    }

    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
    setSelectedDate(null) // Reset selected date when changing month
  }

  const hitsByDay = useMemo(() => {
    const map = new Map<number, number>()
     hits.filter((hit) => {
      if (!hit.created_at) return false
      const hitDate = new Date(hit.created_at)
      return hitDate.getMonth() === currentDate.getMonth() && hitDate.getFullYear() === currentDate.getFullYear()
    })
    .forEach((hit) => {
      const day = new Date(hit.created_at).getDate()
      map.set(day, (map.get(day) || 0) + 1)
    })
    return map
  }, [hits, currentDate])
  
  return (
    <PageView style={styles.container}>
      <Header />

      <Calendar
        onDayPress={handleDayPress}
        selectedDate={selectedDate ?? undefined}
        hits={hits}
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        hitsByDay={hitsByDay}
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
          currentDate={currentDate} 
          hitsByDay={hitsByDay}
        />
      </ScrollView>
    </PageView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
  },
  scrollView: {
    flex: 1,
  },
})
