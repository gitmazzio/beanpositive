import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import StyledText from "../commons/StyledText";

type Hit = {
  id: string;
  title: string;
  description?: string;
  date?: string;
};

type PocketBottomSheetProps = {
  visible: boolean;
  hits: Hit[];
  isLoading: boolean;
  onClose: () => void;
  onDeleteHit: (hitId: string) => void;
};

type HitListProps = {
  hits: Hit[];
  isLoading: boolean;
  emptyMessage: string;
  onDeleteHit: (hitId: string) => void;
  title: string;
  hideTitle?: boolean;
};

const ANIMATION_DURATION = 220;

const HitList: React.FC<HitListProps> = ({
  hits,
  isLoading,
  emptyMessage,
  onDeleteHit,
  title,
  hideTitle,
}) => {
  if (isLoading) {
    return (
      <View style={styles.listContainer}>
        <StyledText kind="body">Caricamento...</StyledText>
      </View>
    );
  }

  if (hits.length === 0) {
    return (
      <View style={styles.listContainer}>
        <StyledText kind="body" style={styles.listEmptyMessage}>
          {emptyMessage}
        </StyledText>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {!hideTitle && (
        <StyledText kind="subtitle" style={styles.listTitle}>
          {title} ({hits.length})
        </StyledText>
      )}
      {hits.map((hit) => (
        <View key={hit.id} style={styles.hitItem}>
          <View style={styles.hitTextContainer}>
            <StyledText kind="body">{hit.title}</StyledText>
            {hit.description ? (
              <StyledText kind="caption">{hit.description}</StyledText>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => onDeleteHit(hit.id)}
            style={styles.deleteButton}
          >
            <StyledText kind="button" style={styles.deleteButtonText}>
              ✕
            </StyledText>
          </Pressable>
        </View>
      ))}
    </View>
  );
};

const PocketBottomSheet: React.FC<PocketBottomSheetProps> = ({
  visible,
  hits,
  isLoading,
  onClose,
  onDeleteHit,
}) => {
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, height, translateY]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
              maxHeight: height * 0.8,
            },
          ]}
        >
          <View style={styles.header}>
            {(hits.length > 0 || isLoading) && (
              <StyledText kind="subtitle" style={styles.headerTitle}>
                Fagioli conservati oggi ({hits.length})
              </StyledText>
            )}
          </View>

          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {hits.length === 0 && !isLoading ? (
              <View style={styles.emptyState}>
                <Image
                  source={
                    // L'immagine deve essere aggiunta manualmente in apps/mobile-app/assets/images/empty_pocket.png
                    require("../../assets/images/empty_pocket.png")
                  }
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
                <StyledText kind="body" style={styles.emptyMessage}>
                  Nessun fagiolo conservato oggi
                </StyledText>
              </View>
            ) : (
              <HitList
                hits={hits}
                isLoading={isLoading}
                emptyMessage="Nessun fagiolo conservato oggi"
                onDeleteHit={onDeleteHit}
                title="Fagioli conservati oggi"
                hideTitle={hits.length === 0 && !isLoading}
              />
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FAFAF5",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    minHeight: 300,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    textAlign: "center",
    color: "#3A1A10",
  },
  contentContainer: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  emptyMessage: {
    marginTop: 16,
    textAlign: "center",
  },
  listContainer: {
    gap: 12,
  },
  listTitle: {
    marginBottom: 4,
  },
  listEmptyMessage: {
    textAlign: "center",
  },
  hitItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  hitTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3E3DD",
  },
  deleteButtonText: {
    color: "#3A1A10",
  },
});

export default PocketBottomSheet;

