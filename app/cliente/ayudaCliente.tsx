// app/ayudaCliente.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Sidebar from './sidebar'; // Import Sidebar component

const AyudaCliente = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.title}>¿Necesitas ayuda? <Text style={styles.icon}></Text></Text>
        </View>

        <View style={styles.helpSection}>
          <TouchableOpacity style={styles.helpCard} onPress={() => router.push('./ayudaCliente')}>
            <Text style={styles.helpTitle}>Tomar Orden</Text>
            <Text style={styles.helpSubtitle}>¿Necesitas un mesero?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpCard} onPress={() => router.push('./ayudaCliente')}>
            <Text style={styles.helpTitle}>Preguntas frecuentes</Text>
            <Text style={styles.helpSubtitle}>¿Estás listo para pedir?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpCard} onPress={() => router.push('./ayudaCliente')}>
            <Text style={styles.helpTitle}>PQRS</Text>
            <Text style={styles.helpSubtitle}>¿Estás listo para pedir?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sidebar at the bottom */}
      <Sidebar />
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
    paddingTop: 40,
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
    backgroundColor: '#FBB03B',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  helpSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
});
