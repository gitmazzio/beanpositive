import PocketProvider from "@/app/contexts/PocketContext"
import { CustomTabBar } from "@/components/CustomTabBar"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { Tabs } from "expo-router"
import DeepLinkHandler from "@/components/DeepLinkHandler"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <PocketProvider>
      <DeepLinkHandler />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {},
        }}
        tabBar={(props) => (
          <CustomTabBar {...(props as Parameters<typeof CustomTabBar>[0])} />
        )}
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
    </PocketProvider>
  )
}
