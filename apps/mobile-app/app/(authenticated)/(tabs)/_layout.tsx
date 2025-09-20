import { CustomTabBar } from "@/components/CustomTabBar";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { PocketProvider } from "../../contexts/PocketContext";
import Toast from "react-native-toast-message";
import { View } from "react-native";
import { toastConfig } from "@/utils/toastConfig";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <PocketProvider>
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
      <View
        style={{
          backgroundColor: "red",
          position: "absolute",
          bottom: 85,
          left: 0,
          right: 0,
        }}
      >
        <Toast config={toastConfig} />
      </View>
    </PocketProvider>
  );
}
