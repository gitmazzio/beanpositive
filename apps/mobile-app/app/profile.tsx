// app/profile.tsx
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "white" }}>
      <Button title="Close" onPress={() => router.back()} />
      <Button title="logout" onPress={logout} />
    </View>
  );
}
