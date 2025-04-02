// app/sidebar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const Sidebar = () => {
  const router = useRouter();

  return (
    <View style={styles.sidebar}>

      <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push("./dashboardCliente")}>
        <MaterialIcons name="home" size={30} color="#fff" />
        <Text style={styles.sidebarText}>Usuarios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push("./codigoQr")}>
        <MaterialIcons name="qr-code" size={30} color="#fff" />
        <Text style={styles.sidebarText}>Productos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push("./ayudaCliente")}>
        <MaterialIcons name="help-outline" size={30} color="#fff" />
        <Text style={styles.sidebarText}>Pedidos</Text>
      </TouchableOpacity>

      

      <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push("./perfil")}>
        <MaterialIcons name="person" size={30} color="#fff" />
        <Text style={styles.sidebarText}>Informes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FBB03B",
    padding: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
  },
  sidebarItem: {
    alignItems: "center",
  },
  sidebarText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
});
