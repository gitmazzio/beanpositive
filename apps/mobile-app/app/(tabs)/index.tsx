import { Button, StyleSheet, View } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { PageView, Text } from "@/components/Themed";
import { useAuth } from "@/providers";

export default function TabOneScreen() {
  const { logout } = useAuth();
  return (
    <PageView style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Button title="Logout" onPress={logout} color="#d32f2f" />
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
