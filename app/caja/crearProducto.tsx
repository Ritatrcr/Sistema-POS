import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import CameraModal from '../../components/cameramodal'; // Asegúrate de importar el componente modal
import { useProduct } from '../../context/productsContext/ProductsContext'; // Importa el contexto
import Sidebar from './sidebar';

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
      calificaciones: [], 
      pasos: procedimiento.split("\n") || [], 
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

        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => setIsModalVisible(true)}
          disabled={!!image} // Deshabilitar el botón si ya hay una imagen seleccionada
        >
          {image ? (
            // Si ya hay imagen seleccionada, mostrar la imagen en lugar del botón
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <>
              <Entypo name="camera" size={24} color="black" />
              <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
            </>
          )}
        </TouchableOpacity>

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
      <Sidebar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainContent: { flex: 1 },
  title: { textAlign:'center',marginTop:50,paddingLeft: 20, paddingTop: 20, fontSize: 28, fontWeight: '600', color: '#333', marginBottom: 20 },
  imageButton: { marginLeft: 'auto', marginRight: 'auto', width: 200, height: 200, backgroundColor: '#FBB03B', padding: 5, borderRadius: 150, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  imageButtonText: { marginTop: 10, fontSize: 16, color: '#333' },
  imagePreview: { width: '100%', height: '100%', borderRadius: 150, resizeMode: 'cover' },
  input: {  marginLeft:20,marginRight:20,backgroundColor: '#F0F0F0', borderRadius: 12, padding: 10, fontSize: 16, marginBottom: 15 ,textAlignVertical: 'center'},
  categoryContainer: {  paddingLeft:20,paddingRight:20,flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  categoryButton: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, width: '22%', alignItems: 'center' },
  categoryText: { fontSize: 14, color: '#333' },
  selectedButton: { backgroundColor: '#FBB03B' },
  timeContainer: {  paddingLeft:20,paddingRight:20,flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  timeButton: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, width: '15%', alignItems: 'center' },
  timeText: { fontSize: 14, color: '#333' },
  saveButton: { marginLeft:20,marginRight:20,backgroundColor: '#FBB03B', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
