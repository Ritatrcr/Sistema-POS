import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import CameraModal from '../../components/cameramodal'; // Asegúrate de importar el componente modal

export default function CrearNuevoProducto() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempoPreparacion, setTiempoPreparacion] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [procedimiento, setProcedimiento] = useState('');
  const [image, setImage] = useState<string | null>(null); // Para la imagen seleccionada
  const [isModalVisible, setIsModalVisible] = useState(false); // Para controlar la visibilidad del modal
  const [selectedCategory, setSelectedCategory] = useState(''); // Para controlar la categoría seleccionada
  const [selectedTime, setSelectedTime] = useState(''); // Para controlar el tiempo de preparación seleccionado

  const handleImageSelect = (uri: string) => {
    setImage(uri); // Guardar la imagen seleccionada
    setIsModalVisible(false); // Cerrar el modal
  };

  const handleSaveProduct = () => {
    // Aquí puedes agregar la lógica para manejar el producto cuando se guarde
    console.log({ nombre, categoria, descripcion, tiempoPreparacion, ingredientes, procedimiento, image });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        {/* Title */}
        <Text style={styles.title}>Crea un nuevo producto</Text>

        {/* Image Select */}
        <TouchableOpacity style={styles.imageButton} onPress={() => setIsModalVisible(true)}>
          <Entypo name="camera" size={24} color="black" />
          <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {/* Image Preview */}
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        {/* Product Name */}
        <TextInput style={styles.input} placeholder="Nombre del Producto" value={nombre} onChangeText={setNombre} />

        {/* Category Selection */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'Platos Fuertes' && styles.selectedButton]}
            onPress={() => setSelectedCategory('Platos Fuertes')}>
            <Text style={styles.categoryText}>Platos Fuertes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'Bebidas' && styles.selectedButton]}
            onPress={() => setSelectedCategory('Bebidas')}>
            <Text style={styles.categoryText}>Bebidas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'Postres' && styles.selectedButton]}
            onPress={() => setSelectedCategory('Postres')}>
            <Text style={styles.categoryText}>Postres</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'Entrada' && styles.selectedButton]}
            onPress={() => setSelectedCategory('Entrada')}>
            <Text style={styles.categoryText}>Entrada</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <TextInput style={styles.input} placeholder="Descripción" multiline value={descripcion} onChangeText={setDescripcion} />

        {/* Preparation Time */}
        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={[styles.timeButton, selectedTime === '15 min' && styles.selectedButton]}
            onPress={() => setSelectedTime('15 min')}>
            <Text style={styles.timeText}>15 min</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeButton, selectedTime === '20 min' && styles.selectedButton]}
            onPress={() => setSelectedTime('20 min')}>
            <Text style={styles.timeText}>20 min</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeButton, selectedTime === '30 min' && styles.selectedButton]}
            onPress={() => setSelectedTime('30 min')}>
            <Text style={styles.timeText}>30 min</Text>
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="Otro" value={tiempoPreparacion} onChangeText={setTiempoPreparacion} />
        </View>

        {/* Ingredients */}
        <TextInput style={styles.input} placeholder="Ingredientes" multiline value={ingredientes} onChangeText={setIngredientes} />

        {/* Procedure */}
        <TextInput style={styles.input} placeholder="Procedimiento" multiline value={procedimiento} onChangeText={setProcedimiento} />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
          <Text style={styles.saveButtonText}>Crear producto</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camera Modal */}
      <CameraModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} setImage={handleImageSelect} />
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
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50, // Imagen en círculo
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 12,
    width: '22%',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedButton: {
    backgroundColor: '#FBB03B', // Color al seleccionar
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeButton: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 12,
    width: '22%',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FBB03B',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
