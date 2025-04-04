import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import CameraModal from '../../components/cameramodal'; // Asegúrate de importar el componente modal
import { useProduct } from '../../context/productsContext/ProductsContext'; // Importa el contexto

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
  const { createProduct } = useProduct(); // Usamos el contexto para crear el producto


  
  const handleImageSelect = (uri: string) => {
    setImage(uri); // Guardar la imagen seleccionada
    setIsModalVisible(false); // Cerrar el modal
  };

  const handleSaveProduct = () => {
    // Validar los campos y asignar "sin información" si están vacíos
    const productData = {
      nombre: nombre || "sin información",
      categoria: selectedCategory || "sin información",
      descripcion: descripcion || "sin información",
      tiempoPreparacion: tiempoPreparacion || "sin información",
      ingredientes: ingredientes || "sin información",
      procedimiento: procedimiento || "sin información",
      calificaciones: [],  // Si no hay calificaciones, inicializar como arreglo vacío
      pasos: procedimiento.split("\n") || [], // Convertir los pasos a un array (si está vacío, dejarlo como un arreglo vacío)
    };
  
    if (image) {
      console.log("URI de la imagen seleccionada:", image); // Verificar la imagen seleccionada
      createProduct(productData, image); // Llamar al método para crear el producto, pasando la imagen
    } else {
      console.log("No se ha seleccionado una imagen"); // Si no hay imagen seleccionada
      createProduct(productData, ""); // Pasar una cadena vacía si no hay imagen
    }
  
    console.log("Producto guardado:", productData); // Para depuración
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <Text style={styles.title}>Crea un nuevo producto</Text>

        <TouchableOpacity style={styles.imageButton} onPress={() => setIsModalVisible(true)}>
          <Entypo name="camera" size={24} color="black" />
          <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <TextInput style={styles.input} placeholder="Nombre del Producto" value={nombre} onChangeText={setNombre} />
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={[styles.categoryButton, selectedCategory === 'Platos Fuertes' && styles.selectedButton]} onPress={() => setSelectedCategory('Platos Fuertes')}>
            <Text style={styles.categoryText}>Platos Fuertes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryButton, selectedCategory === 'Bebidas' && styles.selectedButton]} onPress={() => setSelectedCategory('Bebidas')}>
            <Text style={styles.categoryText}>Bebidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryButton, selectedCategory === 'Postres' && styles.selectedButton]} onPress={() => setSelectedCategory('Postres')}>
            <Text style={styles.categoryText}>Postres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryButton, selectedCategory === 'Entrada' && styles.selectedButton]} onPress={() => setSelectedCategory('Entrada')}>
            <Text style={styles.categoryText}>Entrada</Text>
          </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Descripción" multiline value={descripcion} onChangeText={setDescripcion} />
        <View style={styles.timeContainer}>
          <TouchableOpacity style={[styles.timeButton, selectedTime === '15 min' && styles.selectedButton]} onPress={() => setSelectedTime('15 min')}>
            <Text style={styles.timeText}>15 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.timeButton, selectedTime === '20 min' && styles.selectedButton]} onPress={() => setSelectedTime('20 min')}>
            <Text style={styles.timeText}>20 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.timeButton, selectedTime === '30 min' && styles.selectedButton]} onPress={() => setSelectedTime('30 min')}>
            <Text style={styles.timeText}>30 min</Text>
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="Otro" value={tiempoPreparacion} onChangeText={setTiempoPreparacion} />
        </View>

        <TextInput style={styles.input} placeholder="Ingredientes" multiline value={ingredientes} onChangeText={setIngredientes} />
        <TextInput style={styles.input} placeholder="Procedimiento" multiline value={procedimiento} onChangeText={setProcedimiento} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
          <Text style={styles.saveButtonText}>Crear producto</Text>
        </TouchableOpacity>
      </ScrollView>

      <CameraModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} setImage={handleImageSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  mainContent: { flex: 1 },
  title: { fontSize: 28, fontWeight: '600', color: '#333', marginBottom: 20 },
  imageButton: { backgroundColor: '#F0F0F0', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  imageButtonText: { marginTop: 10, fontSize: 16, color: '#333' },
  imagePreview: { width: 100, height: 100, marginBottom: 20, borderRadius: 50 },
  input: { backgroundColor: '#F0F0F0', borderRadius: 12, padding: 10, fontSize: 16, marginBottom: 15 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  categoryButton: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, width: '22%', alignItems: 'center' },
  categoryText: { fontSize: 14, color: '#333' },
  selectedButton: { backgroundColor: '#FBB03B' },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  timeButton: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, width: '22%', alignItems: 'center' },
  timeText: { fontSize: 14, color: '#333' },
  saveButton: { backgroundColor: '#FBB03B', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
