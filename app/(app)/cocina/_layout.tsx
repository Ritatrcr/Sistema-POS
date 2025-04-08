import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default function CocinaLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 10,
          shadowColor: "#FBB03B",
          shadowOpacity: 0.3,
          shadowOffset: { width: 10, height: 4 },
          shadowRadius: 9,
          borderColor: "#FBB03B",
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FBB03B",
        tabBarInactiveTintColor: "#aaa",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={26} />
          ),
        }}
      />
      import { Ionicons } from '@expo/vector-icons';

      <Tabs.Screen
            name="ordenes"
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="book-outline" color={color} size={26} />
              ),
            }}
          />
          <Tabs.Screen
            name="recetas"
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="restaurant-outline" color={color} size={26} />
              ),
            }}
          />
          

      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}
