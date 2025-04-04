import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Sidebar from "./sidebar";
export default function AgregarProducto() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        {/* Title */}
        <Text style={styles.title}>Agregar Producto</Text>
        <Text style={styles.subTitle}>Crear un nuevo producto</Text>

        {/* Image Select */}
        <TouchableOpacity style={styles.imageButton}>
          <Entypo name="camera" size={24} color="black" />
          <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {/* Product Details Form */}
        <TextInput style={styles.input} placeholder="Nombre del Producto" />
        <TextInput style={styles.input} placeholder="Precio" keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Descripción" multiline />

        

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar Producto</Text>
        </TouchableOpacity>
      </ScrollView>
      <Sidebar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#FBB03B',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
