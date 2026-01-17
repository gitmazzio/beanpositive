import Flex from "@/components/commons/Flex"
import StyledText from "@/components/commons/StyledText"
import { isSameDay, parseISO } from "date-fns"
import { StyleSheet, View } from "react-native"
import { BeanSvgComponent } from "../pocket/BeansMapGeneration"

interface DayDetailsProps {
  selectedDate: Date | null
  hits: any[]
  isLoading: boolean
  currentDate: Date
  hitsByDay: Map<number, number>
}

export default function DayDetails({
  selectedDate,
  hits,
  isLoading,
  currentDate,  
  hitsByDay,
}: DayDetailsProps) {
  // filter hits by selectedDate using date-fns for reliable date comparison
  const filteredHits = selectedDate
    ? (hits || [])?.filter((hit) => {
        if (!hit.created_at) return false
        // Parse the UTC date string and compare with selectedDate
        const hitDate = parseISO(hit.created_at)
        return isSameDay(hitDate, selectedDate)
      })
    : []

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString("it-IT", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   })
  // }

  if(hitsByDay.size === 0 && new Date(currentDate).getMonth() !== new Date().getMonth()) {
    return (
      <View style={styles.container}>
        <StyledText kind="caption" style={styles.noHintsText}>
          Nessun fagiolo conservato in questo mese
        </StyledText>
      </View>
    )
  }

  if (!selectedDate) {
    return (
      <View style={styles.container}>
        <StyledText kind="caption" style={styles.placeholderText}>
          Seleziona un giorno per vedere i dettagli
        </StyledText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <StyledText kind="caption" style={styles.loadingText}>
          Caricamento...
        </StyledText>
      ) : filteredHits.length === 0 ? (
        <StyledText kind="caption" style={styles.noHintsText}>
          {`Nessun fagiolo conservato in questo giorno`}
        </StyledText>
      ) : (
        <Flex direction="column" gap={12}>
          <Flex direction="row" gap={12} align="center" justify="flex-start">
            <StyledText
              kind="body"
              style={{ color: "#404B35", fontWeight: "500" }}
            >
              Fagioli conservati
            </StyledText>
            <Flex
              align="center"
              justify="center"
              style={styles.hintsCountLength}
            >
              <StyledText
                kind="body"
                style={{
                  color: "#404B35",
                  fontWeight: "500",
                }}
              >
                {filteredHits.length}
              </StyledText>
            </Flex>
          </Flex>

          {/* <FlatList
            data={filteredHits}
            keyExtractor={(item, index) => `${item.created_at}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.hintCard}>
                <Flex direction="row" align="center" gap={16}>
                  <BeanSvgComponent color="#D18754" width={18} height={18} />
                  <Flex direction="column" style={styles.hintDetails}>
                    <StyledText kind="body" style={styles.hintTitle}>
                      Fagiolo
                    </StyledText>
                    <StyledText kind="caption" style={styles.hintDetailsText}>
                      {`${formatTime(item.created_at)} ${item.address ? `• ${item.address}` : ""}`}
                    </StyledText>
                  </Flex>
                </Flex>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
          /> */}
          {filteredHits.map((item) => (
            <View style={styles.hintCard}>
              <Flex direction="row" align="center" gap={16}>
                <BeanSvgComponent color="#D18754" width={18} height={18} />
                <Flex direction="column" style={styles.hintDetails}>
                  <StyledText kind="body" style={styles.hintTitle}>
                    Fagiolo
                  </StyledText>
                  <StyledText kind="caption" style={styles.hintDetailsText}>
                    {`${formatTime(item.created_at)} ${item.address ? `• ${item.address}` : ""}`}
                  </StyledText>
                </Flex>
              </Flex>
            </View>
          ))}
        </Flex>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  listContainer: {
    height: 400,
    maxHeight: 400,
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
  },
  dateTitle: {
    color: "#404B35",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
  },
  noHintsText: {
    textAlign: "center",
    color: "#4D5437",
  },
  // hintsCount: {
  //   marginBottom: 8,
  // },
  hintsCountLength: {
    backgroundColor: "#C4C3AA",
    borderRadius: 100,
    color: "#404B35",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  hintCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "#eee",
  },
  beanIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  beanEmoji: {
    fontSize: 16,
  },
  hintDetails: {
    flex: 1,
  },
  hintTitle: {
    color: "#404B35",
    fontWeight: "600",
  },
  hintDetailsText: {
    color: "#798A69",
    fontWeight: "500",
  },
})
