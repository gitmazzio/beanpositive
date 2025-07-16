import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import StyledText from "./commons/StyledText";
import { BeanSimple } from "./svg/BeanSimple";

// Definizione dei tipi per le rotte
type RootTabParamList = {
  Pocket: undefined;
  CustomButton: undefined;
  Diary: undefined;
};

// Tipi per le props delle schermate
type PocketScreenProps = {
  navigation: BottomTabNavigationProp<RootTabParamList, "Pocket">;
  route: RouteProp<RootTabParamList, "Pocket">;
};

type DiaryScreenProps = {
  navigation: BottomTabNavigationProp<RootTabParamList, "Diary">;
  route: RouteProp<RootTabParamList, "Diary">;
};

// Tipi per le icone
type IconName = keyof typeof Ionicons.glyphMap;

const Tab = createBottomTabNavigator<RootTabParamList>();

// / Interfaccia per le props del custom tab bar
interface CustomTabBarProps extends BottomTabBarProps {
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: keyof RootTabParamList;
      params?: object;
    }>;
  };
}

// Custom Tab Bar Component
export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const handleCustomButtonPress = (): void => {
    Alert.alert("Custom Button", "Hai premuto il bottone centrale!", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  const getIconName = (routeName: keyof RootTabParamList): IconName => {
    switch (routeName) {
      case "Pocket":
        return "home";
      case "Diary":
        return "book";
      default:
        return "home";
    }
  };

  console.log("LOG", state.index);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const isFocusedPocket = state.index === 0;

        const onPress = (): void => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Custom button centrale
        if (index === 1) {
          return (
            <View style={styles.tabBarSection} key="custom">
              <StyledText
                kind="body"
                style={{
                  position: "absolute",
                  top: -70,
                  fontWeight: 600,
                  color: "#C7682F",
                  width: 300,
                }}
                textAlign="center"
              >
                Aggiungi un fagiolo
              </StyledText>
              <TouchableOpacity
                style={styles.customButton}
                onPress={handleCustomButtonPress}
                activeOpacity={0.8}
                disabled={!isFocusedPocket}
              >
                <View style={styles.customButtonInner}>
                  <BeanSimple />
                </View>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabBarItem}
            activeOpacity={0.7}
          >
            <FontAwesome6
              name="house"
              size={20}
              color={!isFocused ? "#636B45" : "#383C2B"}
            />

            <StyledText
              kind="body"
              style={[
                styles.tabBarLabel,
                { color: !isFocused ? "#636B45" : "#383C2B" },
                { fontWeight: isFocused ? "700" : "400" },
              ]}
            >
              {typeof label === "string" ? label : route.name}
            </StyledText>
          </TouchableOpacity>
        );
      })}

      {/* Terzo tab per bilanciare il layout */}
      <TouchableOpacity
        onPress={() => navigation.navigate("diary")}
        style={styles.tabBarItem}
        activeOpacity={0.7}
      >
        <FontAwesome6
          name="book-bookmark"
          size={20}
          color={state.index !== 1 ? "#636B45" : "#383C2B"}
        />
        <StyledText
          kind="body"
          style={[
            styles.tabBarLabel,
            { color: state.index !== 1 ? "#636B45" : "#383C2B" },
            { fontWeight: state.index === 1 ? "700" : "400" },
          ]}
        >
          Diario
        </StyledText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3748",
    marginTop: 16,
  },
  screenDescription: {
    fontSize: 16,
    color: "#718096",
    marginTop: 8,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FEF5E6",
    height: 80,
    shadowColor: "#404B35",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBarSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  customButton: {
    width: 72,
    height: 72,
    borderRadius: 100,
    backgroundColor: "#D57E3A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
    top: -40,
  },
  customButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
