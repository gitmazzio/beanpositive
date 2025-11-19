import React, { useState, useMemo } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useAuth } from "@/providers"
import { useUserHitsByMonth } from "@/queries/mutations/useUserHitsByMonth"
import StyledText from "@/components/commons/StyledText"
import Flex from "@/components/commons/Flex"
import { FontAwesome6 } from "@expo/vector-icons"
import { BeanSvgComponent } from "../pocket/BeansMapGeneration"
import { CalendarDayBorder } from "../svg/CalendarDayBorder"
import { TodayDayBackground } from "../svg/TodayDayBackground"

interface CalendarProps {
  onDayPress?: (date: Date) => void
  selectedDate?: Date
  hits: any[]
  currentDate: Date
  setCurrentDate: (date: Date) => void
}

export default function Calendar({
  onDayPress,
  selectedDate,
  hits,
  currentDate,
  setCurrentDate,
}: CalendarProps) {
  const { user } = useAuth()

  // Get account creation date to limit navigation
  const accountCreationDate = user?.created_at
    ? new Date(user.created_at)
    : new Date()
  const minDate = new Date(
    accountCreationDate.getFullYear(),
    accountCreationDate.getMonth(),
    1
  )

  // Create a map of days with hints for quick lookup
  const hitsByDay = useMemo(() => {
    const map = new Map<number, number>()
    hits.forEach((hit) => {
      const day = new Date(hit.created_at).getDate()
      map.set(day, (map.get(day) || 0) + 1)
    })
    return map
  }, [hits])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const startDate = new Date(year, month, 1 - firstDay.getDay())

    const days = []

    // Generate 42 days (6 weeks) starting from the calculated start date
    for (let i = 0; i < 42; i++) {
      const dayDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i
      )
      days.push(dayDate)
    }

    return days
  }, [currentDate])

  const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ]

  const dayNames = ["D", "L", "M", "M", "G", "V", "S"]

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)

    // Check if we can go back (not before account creation)
    if (newDate >= minDate) {
      setCurrentDate(newDate)
    }
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)

    // Don't allow going to future months
    const today = new Date()
    if (newDate <= today) {
      setCurrentDate(newDate)
    }
  }

  const isCurrentMonth = (date: Date) => {
    return (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    )
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isFutureDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate > today
  }

  const canGoPrevious =
    currentDate.getMonth() > minDate.getMonth() &&
    currentDate.getFullYear() >= minDate.getFullYear()
  const canGoNext =
    currentDate.getMonth() < new Date().getMonth() &&
    currentDate.getFullYear() <= new Date().getFullYear()

  return (
    <View>
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        style={styles.header}
      >
        <StyledText kind="h3" style={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </StyledText>

        <Flex direction="row" gap={8}>
          <TouchableOpacity
            onPress={goToPreviousMonth}
            disabled={!canGoPrevious}
          >
            <FontAwesome6
              name="chevron-left"
              color={!canGoPrevious ? "#eee" : "#404B35"}
              size={20}
              solid
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextMonth} disabled={!canGoNext}>
            <FontAwesome6
              name="chevron-right"
              color={!canGoNext ? "#eee" : "#404B35"}
              size={20}
              solid
            />
          </TouchableOpacity>
        </Flex>
      </Flex>

      <Flex direction="column" style={styles.container}>
        {/* Day names */}
        <Flex direction="row" style={styles.dayNamesRow}>
          {dayNames.map((day, index) => (
            <View key={index} style={styles.dayNameCell}>
              <StyledText kind="caption" style={styles.dayName}>
                {day}
              </StyledText>
            </View>
          ))}
        </Flex>

        {/* Calendar grid */}
        <View style={[styles.calendarGrid]}>
          {calendarDays.map((date, index) => {
            const day = date.getDate()
            const hasHints = hitsByDay.has(day) && isCurrentMonth(date)
            const isCurrentMonthDay = isCurrentMonth(date)
            const isTodayDay = isToday(date)
            const isFuture = isFutureDate(date)

            const isSelected =
              selectedDate &&
              selectedDate.getDate() === date.getDate() &&
              selectedDate.getMonth() === date.getMonth() &&
              selectedDate.getFullYear() === date.getFullYear()

            return (
              <TouchableOpacity
                key={index}
                style={styles.dayCell}
                onPress={() => onDayPress?.(date)}
                disabled={!isCurrentMonthDay || isFuture}
              >
                {isTodayDay && (
                  <View style={styles.todayDayBackground}>
                    <TodayDayBackground />
                  </View>
                )}
                {isSelected && (
                  <View style={styles.selectedDayBorder}>
                    <CalendarDayBorder
                      color={isTodayDay ? "#798A69" : "#C8C8C8"}
                    />
                  </View>
                )}
                <StyledText
                  kind="body"
                  style={[
                    styles.dayText,
                    !isCurrentMonthDay && styles.otherMonthText,
                    isFuture && styles.futureDayText,
                    isTodayDay && styles.todayText,
                    isSelected && styles.selectedDayText,
                  ]}
                >
                  {day}
                </StyledText>
                {hasHints && (
                  <View style={styles.hintIndicator}>
                    <BeanSvgComponent color="#D18754" width={10} height={10} />
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </Flex>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
  },
  header: {
    marginBottom: 16,
  },
  disabledChevron: {
    color: "#f0f0f0",
  },
  navText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#404B35",
  },
  disabledText: {
    color: "#ccc",
  },
  monthTitle: {
    color: "#404B35",
    fontWeight: "600",
  },
  dayNamesRow: {
    marginBottom: 8,
  },
  dayNameCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayName: {
    color: "#404B35",
    fontWeight: "500",
    opacity: 0.6,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    height: 46,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 8,
    marginVertical: 2,
  },
  todayDayBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  dayWithHints: {
    backgroundColor: "#FFF3E0",
  },
  dayText: {
    fontSize: 16,
    color: "#404B35",
  },
  otherMonthText: {
    color: "#ccc",
  },
  futureDayText: {
    color: "#ddd",
  },
  todayText: {
    color: "#404B35",
    fontWeight: "800",
  },
  dayWithHintsText: {
    color: "#E65100",
    fontWeight: "600",
  },
  hintIndicator: {
    position: "absolute",
    bottom: 0,
  },
  hintCount: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "#404B35",
    fontWeight: "800",
  },
  selectedDayBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
})
