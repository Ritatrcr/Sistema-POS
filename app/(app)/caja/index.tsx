// app/ayudaCliente.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "../../../context/authContext/AuthContext";


const AyudaCliente = () => {
  const router = useRouter();
   const { userName, user } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Hola, {userName || "Invitado"}</Text>
          
        </View>

        <View style={styles.helpSection}>
          <TouchableOpacity style={styles.helpCard} onPress={() => router.push('/caja/productos')}>
            <Text style={styles.helpTitle}>Productos</Text>
            <Text style={styles.helpSubtitle}>Visualiza,modifica o elimina tus productos </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpCard} onPress={() => router.push('/caja/crearProducto')}>
            <Text style={styles.helpTitle}>Crear producto</Text>
            <Text style={styles.helpSubtitle}>Toma o selecciona la foto del producto, agrega sus caracteristicas y crealo.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpCard} onPress={() => router.push('/caja/informes')}>
            <Text style={styles.helpTitle}>Informes</Text>
            <Text style={styles.helpSubtitle}>Genera informes de: ¿Que es lo que mas piden en tu negocio? etc..</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpCard} onPress={() => router.push('/caja/pedidos')}>
            <Text style={styles.helpTitle}>Pedidos</Text>
            <Text style={styles.helpSubtitle}>Gestiona tus Pedidos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpCard} onPress={() => router.push('/caja/usuarios')}>
            <Text style={styles.helpTitle}>Usuarios</Text>
            <Text style={styles.helpSubtitle}>Gestiona tus usuarios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    
      
    </View>
  );
};

export default AyudaCliente;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  icon: {
    color: '#FBB03B',
  },
  helpSection: {
    marginTop: 30,
  },
  helpCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FBB03B',
    shadowColor: '#000',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A36F3E',
  },
  helpSubtitle: {
    fontSize: 14,
    color: '',
    marginTop: 5,
  },
});
