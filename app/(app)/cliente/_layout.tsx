// app/(app)/cliente/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ClienteLayout() {
  return (
    <Tabs screenOptions={{tabBarStyle: {backgroundColor: "#FBB03B", },tabBarActiveTintColor: "#FFF",  tabBarInactiveTintColor: "#000", }}
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
        name="ayudaCliente"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="codigoQR"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="perfil"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />


      <Tabs.Screen
        name="verOrdenes"
        options={{
            headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
