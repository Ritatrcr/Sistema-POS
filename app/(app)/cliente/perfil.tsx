// app/perfil.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "../../../context/authContext/AuthContext"; // Importa el contexto de autenticación
import { Ionicons } from '@expo/vector-icons';


const Perfil = () => {
  const router = useRouter();
  const { userName, userEmail, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={{ position: 'relative' }}>
          <Image 
            source={require('../../../assets/images/user.png')} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editIcon} onPress={() => router.push('./editarPerfil')}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.profileName}>{userName || "Nombre no disponible"}</Text>
        <Text style={styles.profileEmail}>{userEmail || "Correo no disponible"}</Text>
      </View>

      <View style={styles.optionsSection}>
        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={() => router.push('./cambiarContraseña')}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.iconLeft} />
          <Text style={styles.optionTitle}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={() => router.push('./configuracion')}>
          <Ionicons name="settings-outline" size={20} color="#fff" style={styles.iconLeft} />
          <Text style={styles.optionTitle}>Configuración</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard} 
          onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.iconLeft} />
          <Text style={styles.optionTitle}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

     
    </View>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#FBB03B',
    marginTop: 20,
    backgroundColor: '#FBB03B',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    }
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FBB03B',
    padding: 6,
    borderRadius: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
