import PocketProvider from "@/app/contexts/PocketContext"
import { CustomTabBar } from "@/components/CustomTabBar"
import { CameraScreen } from "@/components/CameraScreen"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { Tabs } from "expo-router"
import usePocketContext from "@/app/hooks/usePocketContext"

function TabsWithCamera() {
  const colorScheme = useColorScheme()
  const { isCameraVisible, closeCamera } = usePocketContext()

  return (
    <>
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
      <CameraScreen
        visible={isCameraVisible}
        onClose={closeCamera}
      />
    </>
  )
}

export default function TabLayout() {
  return (
    <PocketProvider>
      <TabsWithCamera />
    </PocketProvider>
  )
}
