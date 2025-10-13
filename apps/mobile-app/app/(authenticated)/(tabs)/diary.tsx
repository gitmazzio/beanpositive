import { Header } from "@/components/authenticated/Header";
import Flex from "@/components/commons/Flex";
import { PageView } from "@/components/Themed";
import { StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <PageView style={styles.container}>
      <Header />
      <Flex align="center" justify="center" style={[{ flex: 1 }]} />
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
