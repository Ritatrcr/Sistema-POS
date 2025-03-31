// app/perfil.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "../../context/authContext/AuthContext"; // Importa el contexto de autenticación
import Sidebar from './sidebar'; // Import Sidebar component

const Perfil = () => {
  const router = useRouter();
  const { userName, userEmail } = useAuth(); // Obtener nombre y correo del usuario desde el contexto

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.profileSection}>
        <Image 
          source={{uri: 'https://via.placeholder.com/150'}} 
          style={styles.profileImage} 
        />
        {/* Mostrar el nombre y correo del usuario si están disponibles */}
        <Text style={styles.profileName}>{userName || "Nombre no disponible"}</Text>
        <Text style={styles.profileEmail}>{userEmail || "Correo no disponible"}</Text>
      </View>

      <View style={styles.optionsSection}>
        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={() => router.push('./editarPerfil')}>
          <Text style={styles.optionTitle}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={() => router.push('./cambiarContraseña')}>
          <Text style={styles.optionTitle}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={() => router.push('./configuracion')}>
          <Text style={styles.optionTitle}>Configuración</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar at the bottom */}
      <Sidebar />
    </View>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 40,
    paddingLeft: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  optionsSection: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  optionCard: {
    backgroundColor: '#FBB03B',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
