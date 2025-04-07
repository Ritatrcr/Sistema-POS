import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default function ClienteLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
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

      <Tabs.Screen
        name="verOrdenes"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" color={color} size={28} />
          ),
        }}
      />

      <Tabs.Screen
        name="codigoQr"
        options={{
          tabBarIcon: () => (
            <View style={styles.qrButton}>
              <Ionicons name="qr-code-outline" size={30} color="#fff" />
            </View>
          ),
        }}
      />

<Tabs.Screen
        name="ayudaCliente"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="help-circle-outline" color={color} size={26} />
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

const styles = StyleSheet.create({
  qrButton: {
    backgroundColor: "#FBB03B",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30, // eleva el botón
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 9,
    elevation: 15,
    top: -10, // eleva el botón
  },
});
