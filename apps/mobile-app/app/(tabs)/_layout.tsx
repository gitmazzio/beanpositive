import { CustomTabBar } from "@/components/CustomTabBar";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
// import { Header } from "./components/Header";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Tasca",
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          tabBarLabel: "Diario",
        }}
      />
    </Tabs>
  );
}
