import React from "react";
import { View, StyleSheet } from "react-native";
import { useNotifications } from "../../hooks/useNotifications";
import StyledText from "./StyledText";

interface NotificationStatusProps {
  style?: any;
}

export const NotificationStatus: React.FC<NotificationStatusProps> = ({
  style,
}) => {
  const { hasPermission, deviceId, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <StyledText kind="body" style={styles.loadingText}>
          Controllo stato notifiche...
        </StyledText>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <StyledText kind="body" style={styles.statusText}>
        Notifiche: {hasPermission ? "✅ Abilitate" : "❌ Disabilitate"}
      </StyledText>
      {deviceId && (
        <StyledText kind="caption" style={styles.deviceIdText}>
          Device ID: {deviceId.substring(0, 8)}...
        </StyledText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginVertical: 4,
  },
  statusText: {
    fontWeight: "500",
    color: "#333",
  },
  deviceIdText: {
    marginTop: 4,
    color: "#666",
    fontFamily: "monospace",
  },
  loadingText: {
    color: "#999",
    fontStyle: "italic",
  },
});
