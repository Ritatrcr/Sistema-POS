// app/(app)/caja/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CajaLayout() {
  return (
    <Tabs screenOptions={{tabBarStyle: {backgroundColor: "#FBB03B" } ,tabBarActiveTintColor: "#FFF",  tabBarInactiveTintColor: "#000"}}
    >

      <Tabs.Screen
        name="index"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="crearProducto"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />

  
      <Tabs.Screen
        name="informes"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="pedidos"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
        }}
      />

   
      <Tabs.Screen
        name="platos"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food-outline" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="usuarios"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
