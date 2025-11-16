import Flex from "@/components/commons/Flex";
import StyledText from "@/components/commons/StyledText";
import { useAuth } from "@/providers";
import { useUserHitsByDay } from "@/queries/mutations/useUserHitsByDay";
import { StyleSheet, View } from "react-native";

interface DayDetailsProps {
  selectedDate: Date | null;
  hits: any[];
  isLoading: boolean;
}

export default function DayDetails({
  selectedDate,
  hits,
  isLoading,
}: DayDetailsProps) {
  const { user } = useAuth();

  const dateString = selectedDate
    ? selectedDate.toISOString().slice(0, 10)
    : null;

  if (hits?.length === 0) {
    return null;
  }

  console.log("LOG", dateString);

  // filter hits by selectedDate
  const filteredHits = (hits || [])?.filter((hit) => {
    return hit.created_at.startsWith(dateString);
  });

  console.log("LOG", filteredHits);

  if (!selectedDate) {
    return (
      <View style={styles.container}>
        <StyledText kind="body" style={styles.placeholderText}>
          Seleziona un giorno per vedere i dettagli
        </StyledText>
      </View>
    );
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <StyledText kind="caption" style={styles.loadingText}>
          Caricamento...
        </StyledText>
      ) : filteredHits.length === 0 ? (
        <StyledText kind="caption" style={styles.noHintsText}>
          {`Nessun fagiolo conservato ${formatDate(selectedDate)}`}
        </StyledText>
      ) : (
        <Flex direction="column" gap={12}>
          <StyledText kind="subtitle" style={styles.hintsCount}>
            Fagioli conservati: {hits.length}
          </StyledText>

          {filteredHits.map((hit, index) => (
            <View key={index} style={styles.hintCard}>
              <Flex direction="row" align="center" gap={12}>
                <View style={styles.beanIcon}>
                  <StyledText kind="caption" style={styles.beanEmoji}>
                    🫘
                  </StyledText>
                </View>

                <Flex direction="column" style={styles.hintDetails}>
                  <StyledText kind="body" style={styles.hintTitle}>
                    Fagiolo
                  </StyledText>
                  <StyledText kind="caption" style={styles.hintTime}>
                    {formatTime(hit.created_at)}
                  </StyledText>
                  {hit.address && (
                    <StyledText kind="caption" style={styles.hintAddress}>
                      {hit.address}
                    </StyledText>
                  )}
                </Flex>
              </Flex>
            </View>
          ))}
        </Flex>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    marginVertical: 16,
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
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
  hintsCount: {
    color: "#E65100",
    fontWeight: "600",
    marginBottom: 8,
  },
  hintCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
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
    color: "#E65100",
    fontWeight: "600",
    marginBottom: 2,
  },
  hintTime: {
    color: "#666",
    marginBottom: 2,
  },
  hintAddress: {
    color: "#888",
    fontStyle: "italic",
  },
});
