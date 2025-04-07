// app/(app)/caja/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CajaLayout() {
  return (
    <Tabs screenOptions={{
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
