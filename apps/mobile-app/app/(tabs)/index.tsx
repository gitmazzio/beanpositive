import { StyleSheet, View } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { PageView, Text } from "@/components/Themed";
import { useAuth } from "@/providers";
import { addTestRow } from "@/api/hits";
import { Button } from "@/components/commons/Button";
import { useAddHit } from "@/queries/mutations/useAddHit";
import { useUserHitsByDay } from "@/queries/mutations/useUserHitsByDay";

export default function TabOneScreen() {
  const { logout, user } = useAuth();
  const addHit = useAddHit();

  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const { data: hits, isLoading, error } = useUserHitsByDay(user?.id, today);

  const handleAddRow = async () => {
    if (!user) {
      return;
    }

    try {
      addHit.mutate({ address: "Via Monte Napoleone" });
      alert("Row added!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <PageView style={styles.container}>
      <Text style={styles.title}>Tab One {hits?.length}</Text>
      {/* <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      /> */}

      <Button title="hit" onPress={handleAddRow} disabled={addHit.isPending} />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Button title="Logout" onPress={logout} kind="tertiary" />
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
