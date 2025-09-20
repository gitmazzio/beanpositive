import { Dimensions, StyleSheet, View } from "react-native";
import { Header } from "@/components/authenticated/Header";
import { Pocket } from "@/components/pocket";
import { AnimatedBean } from "@/components/pocket/animatedBean";
import { PageView } from "@/components/Themed";
import { useAuth } from "@/providers";
import { useUserHitsByDay } from "@/queries/mutations/useUserHitsByDay";
import { usePocketContext } from "../../hooks/usePocketContext";
import { Button } from "@/components/commons/Button";

const { width, height } = Dimensions.get("window");

export default function Homepage() {
  const { logout, user } = useAuth();

  const {
    rotationPrimaryAnim,
    scalePrimaryAnim,
    movePrimaryAnim,
    rotationSecondaryAnim,
    scaleSecondaryAnim,
    moveSecondaryAnim,
    animatedBeanValue,
    translateBeanX,
    translateBeanY,
    opacityBean,
  } = usePocketContext();

  // const [hits, setHits] = useState(0);
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const { data: hits, error } = useUserHitsByDay(user?.id, today);

  return (
    <PageView style={styles.container}>
      <Header />
      <View style={[styles.pocketContainer, { position: "relative" }]}>
        <AnimatedBean
          animatedValue={animatedBeanValue}
          translateX={translateBeanX}
          translateY={translateBeanY}
          opacity={opacityBean}
        />
        <Pocket
          scale={0.8}
          animatedRotation={rotationPrimaryAnim}
          animatedScale={scalePrimaryAnim}
          animatedMove={movePrimaryAnim}
          style={{
            zIndex: 2, // Ensure this pocket is above the first one
          }}
          pocketId="primary"
          withNumber={true}
          hintNumber={hits?.length || 0}
        />
        <Pocket
          scale={0.7}
          animatedRotation={rotationSecondaryAnim}
          animatedScale={scaleSecondaryAnim}
          animatedMove={moveSecondaryAnim}
          style={{
            zIndex: 1, // Ensure this pocket is above the first one
            position: "absolute",
          }}
          color="#E1A56D"
          pocketId="secondary"
          borderColor="#D3864A"
          tabColor="#F3DFD2"
          tabText="Tasca destra"
          tabTextColor="#381110"
        />
      </View>
      {/* <Button title="hit" onPress={handleAddRow} disabled={addHit.isPending} /> */}
      {/* <Button onPress={logout} title="logout" /> */}
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pocketContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
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
