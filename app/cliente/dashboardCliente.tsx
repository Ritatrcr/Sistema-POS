import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TouchableHighlight } from "react-native";
import { useProduct } from "../../context/productsContext/productsContext"; // Asegúrate de que la ruta sea correcta
import Sidebar from "./sidebar";
import { useAuth } from "../../context/authContext/AuthContext";

// Tipos para los productos
interface Product {
  id: string;
  nombre: string;
  ingredientes: string;
  tiempoPreparacion: string;
  calificaciones: number[];
  categoria: string;
  descripcion: string;
  pasos: string[];
  imageUrl: string; // Asegúrate de tener esta propiedad en tus datos
}

const { userName } = useAuth(); // Obtenemos el nombre del usuario

const HomeScreen: React.FC = () => {
  const { products, fetchAllProducts } = useProduct();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar el loader
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Estado para mostrar el modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Producto seleccionado

  // Filtrado de productos por nombre
  useEffect(() => {
    const loadProducts = async () => {
      await fetchAllProducts(); // Asumimos que esto es asincrónico
      setLoading(false); // Cambiar el estado de loading a false cuando los productos se han cargado
    };
    loadProducts();
  }, [fetchAllProducts]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product: { nombre: string; }) =>
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Categorías de los productos
  const categories = ["Todas", "Entradas", "Platos Fuertes", "Bebidas", "Postres", "Favoritos"];

  // Función para renderizar cada producto
  const renderItem = ({ item }: { item: Product }) => {
    // Calificación del producto (mostramos el número y las estrellas)
    const rating = item.calificaciones.length > 0 ? item.calificaciones[0] : 0;
    const stars = Array.from({ length: 5 }, (_, index) => index < rating ? "★" : "☆").join(" ");

    return (
      <TouchableOpacity onPress={() => { setSelectedProduct(item); setModalVisible(true); }} style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.itemName}>{item.nombre}</Text>
          <Text style={styles.itemDetails}>
            {item.tiempoPreparacion} mins - {item.categoria}
          </Text>
          <View style={styles.itemRating}>
            <Text style={styles.ratingText}>
              {stars} ({rating}) {/* Muestra las estrellas y el número de la calificación */}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null); // Limpiar el producto seleccionado cuando se cierre el modal
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {userName || "Invitado"}</Text>
          <Text style={styles.question}>¿De qué tienes antojos hoy?</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Escribe para buscar"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Sección de categorías */}
        <ScrollView horizontal style={styles.categories} showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && { backgroundColor: "#ff8403" },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sección de platos */}
        <View style={styles.foodSection}>
          {/* Mostrar "Todos los Platos" o la categoría seleccionada */}
          <Text style={styles.sectionTitle}>
            {selectedCategory === "Todas" ? "Todos los Platos" : selectedCategory}
          </Text>

          {/* Mostrar loader mientras se cargan los productos */}
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#ff8403" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredProducts
                .filter((item) => selectedCategory === "Todas" || item.categoria === selectedCategory)
                .map((item) => renderItem({ item }))}
            </ScrollView>
          )}
        </View>

        {/* Sección de Recomendados */}
        <View style={styles.foodSection}>
          <Text style={styles.sectionTitle}>Recomendados</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredProducts
              .filter((plato) => plato.calificaciones.length > 0 && plato.calificaciones[0] >= 4.5)
              .map((item) => renderItem({ item }))}
          </ScrollView>
        </View>
      </ScrollView>
      <Sidebar />

      {/* Modal para mostrar los detalles del producto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedProduct && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedProduct.nombre}</Text>
              <Text style={styles.modalDescription}>{selectedProduct.descripcion}</Text>
              <Text style={styles.modalIngredients}>Ingredientes: {selectedProduct.ingredientes}</Text>
              <Text style={styles.modalSteps}>Pasos: {selectedProduct.pasos.join(", ")}</Text>
              <TouchableHighlight
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
  },
  question: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
  },
  searchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 10,
    marginTop: 15,
    fontSize: 16,
  },
  categories: {
    marginVertical: 20,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FBB03B",
    marginRight: 10,
  },
  categoryText: {
    color: "#fff",
    fontWeight: "600",
  },
  foodSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  card: {
    width: 150,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    overflow: "hidden",
  },
  foodImage: {
    width: "100%",
    height: 100,
  },
  cardInfo: {
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  itemRating: {
    flexDirection: "row", // Para mostrar las estrellas en línea
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: "#FBB03B",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalIngredients: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalSteps: {
    fontSize: 14,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#ff8403",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default HomeScreen;
