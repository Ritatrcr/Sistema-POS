import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Dimensions } from "react-native";
import { useProduct } from "../../../context/productsContext/ProductsContext"; 
import { Ionicons } from "@expo/vector-icons";
import ProductEditModal from "../../../components/ProductEditModal"; // Importando el modal para editar producto

interface Product {
  id: string;
  nombre: string;
  ingredientes: string;
  tiempoPreparacion: string;
  calificaciones: number[];
  categoria: string;
  descripcion: string;
  imageUrl: string;
  pasos: string[];
  precio: number;
}

const { width } = Dimensions.get("window");  // Obtener el ancho de la pantalla para hacerla responsive

const HomeScreen: React.FC = () => {
  const { products, fetchAllProducts } = useProduct();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      await fetchAllProducts();
      setLoading(false);
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

  const categories = ["Todas", "Entrada", "Platos Fuertes", "Bebidas", "Postres", "Favoritos"];

  const renderItem = (item: Product) => {
    return (
      
      <TouchableOpacity onPress={() => setSelectedProduct(item)} style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.itemName}>{item.nombre}</Text>
          <Text style={styles.itemDetails}>{item.precio} $</Text>
          <Text style={styles.itemDetails}>{item.tiempoPreparacion} mins - {item.categoria}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Edita o elimina tus productos</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Escribe para buscar"
        placeholderTextColor="#B0B0B0"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
  
      <ScrollView horizontal style={styles.categories}>
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                isSelected ? styles.categoryButtonSelected : styles.categoryButtonUnselected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isSelected ? styles.categoryTextSelected : styles.categoryTextUnselected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.foodSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === "Todas" ? "Todos los Platos" : selectedCategory}
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ff8403" />
        ) : (
          <View style={styles.productsContainer}>
            {filteredProducts
              .filter((item) => selectedCategory === "Todas" || item.categoria === selectedCategory)
              .map((item) => renderItem(item))}
          </View>
        )}
      </ScrollView>

      {/* Modal de edición de producto */}
      {selectedProduct && (
        <ProductEditModal 
          product={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 40 },
  titulo: { fontSize: 28, fontWeight: "600", color: "#333", marginBottom: 20 },
  searchInput: { backgroundColor: "#F0F0F0", borderRadius: 12, padding: 10, marginTop: 15, fontSize: 16 },
  categories: { marginTop: 20, marginBottom: 40, paddingLeft: 10, paddingRight: 10, alignContent: "center", height: 100, maxHeight: 40 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, minHeight: 40, borderWidth: 1, borderColor: "#FBB03B" },
  categoryButtonSelected: { backgroundColor: "#FBB03B" },
  categoryButtonUnselected: { backgroundColor: "transparent" },
  categoryText: { marginBottom: 30, fontWeight: "600", fontSize: 16 },
  categoryTextSelected: { color: "#fff" },
  categoryTextUnselected: { color: "#aaa" },
  foodSection: { marginBottom: 40 },
  sectionTitle: { fontSize: 22, fontWeight: "600", color: "#333", marginBottom: 15 },
  productsContainer: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: width * 0.20, marginBottom: 15, borderRadius: 15, backgroundColor: "#F8F8F8", position: "relative", padding: 10 },
  foodImage: { width: "100%", height: 120, borderRadius: 10 },
  cardInfo: { paddingTop: 10 },
  itemName: { fontSize: 16, fontWeight: "600", color: "#333" },
  itemDetails: { fontSize: 14, color: "#666", marginTop: 5 },
});
export default HomeScreen;
