import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useProduct } from "../../../context/productsContext/ProductsContext"; 
import { useAuth } from "../../../context/authContext/AuthContext";

import { Alert } from "react-native";
import { useOrder } from "../../../context/orderContext/OrderContext";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";



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

const HomeScreen: React.FC = () => {
  const { products, fetchAllProducts } = useProduct();
  const { userName, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const { createOrder } = useOrder();
  const [loadingOrder, setLoadingOrder] = useState(false);
  const router = useRouter();



  const confirmarOrden = async () => {
    if (!user) return;
  
    setLoadingOrder(true); // Mostrar loader
  
    const nuevaOrden = {
      producto: cart.map((item) => ({
        idProducto: item.id,
        cantidad: item.quantity,
      })),
      precioTotal: parseFloat(calcularTotal()),
      estado: "ordenado",
      userId: user.uid,
    };
  
    try {
      await createOrder(nuevaOrden);
      setCart([]);
      setShowCart(false);
      router.push("/(app)/cliente/verOrdenes");

    } catch (error) {
      console.error("Error al crear orden:", error);
      Alert.alert("Error", "No se pudo crear la orden.");
    } finally {
      setLoadingOrder(false);
    }
  };
  
  const increaseQuantity = (index: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };
  
  const decreaseQuantity = (index: number) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    }
  };
  
  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };


  const calcularTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.quantity, 0).toFixed(2);
  };

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

  const renderItem = ({ item }: { item: Product }) => {
    const rating = item.calificaciones.length > 0 ? item.calificaciones[0] : 0;
    const stars = Array.from({ length: 5 }, (_, index) => index < rating ? "★" : "☆").join(" ");

    const addToCart = () => {
      const existingIndex = cart.findIndex(p => p.id === item.id);
      if (existingIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...item, quantity: 1 }]);
      }
    };
  
    
 
    

    return (
      <TouchableOpacity onPress={() => { setSelectedProduct(item); setModalVisible(true); }} style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.itemName}>{item.nombre}</Text>
          <Text style={styles.itemDetails}>{item.precio} $</Text>
          <Text style={styles.itemDetails}>{item.tiempoPreparacion} mins - {item.categoria}</Text>
          {item.calificaciones.length > 0 && (
            <Text style={styles.ratingText}>{stars}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addToCart}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };



  return (
    <View style={styles.container}>
      {showCart ? (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
         
          <View style={styles.cartHeader}>
          <TouchableOpacity onPress={() => setShowCart(false)} style={styles.backButton}>
              <AntDesign name="leftcircleo" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Tu Carrito</Text>
          </View>

          <ScrollView style={{ marginBottom: 80 }}>
            {cart.length === 0 ? (
              <Text style={styles.emptyText}>No hay productos en tu carrito</Text>
            ) : (
              cart.map((item, index) => (
                <View key={index} style={styles.cartCard}>
                  <View style={styles.cartCardInfo}>
                    <Image source={{ uri: item.imageUrl }} style={styles.cartCardImage} />
                    <View style={styles.cartCardDetails}>
                      <Text style={styles.itemName}>{item.nombre}</Text>
                      <Text style={styles.itemDetails}>${item.precio}</Text>
                      <Text style={styles.itemDetails}>{item.descripcion}</Text>

                      <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={() => decreaseQuantity(index)} style={styles.quantityButton}>
                          <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => increaseQuantity(index)} style={styles.quantityButton}>
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => removeFromCart(index)} style={styles.trashButton}>
                          <Ionicons name="trash-bin-outline" size={24} color="black" /> {/* Ícono de papelera */}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          

          {cart.length > 0 && (
            <View style={styles.fixedOrderButtonContainer}>
            <TouchableOpacity style={styles.orderButton} onPress={confirmarOrden}>
              <Text style={styles.orderButtonText}>Ordenar ${calcularTotal()}</Text>
            </TouchableOpacity>
          </View>
          
          )}
        </View>
      ) : (

        <ScrollView style={styles.mainContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>Hola, {userName || "Invitado"}</Text>

            <TouchableOpacity style={styles.cartIconButton} onPress={() => setShowCart(true)}>
              <Ionicons name="cart-outline" size={28} color="grey" />
              {cart.length > 0 && <Text style={styles.cartCount}>{cart.length}</Text>}
            </TouchableOpacity>

          </View>

              <Text style={styles.question}>¿De qué tienes antojos hoy?</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Escribe para buscar"
                placeholderTextColor="#B0B0B0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
  
          <ScrollView horizontal style={styles.categories} showsHorizontalScrollIndicator={false}>
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

          <View style={styles.foodSection}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "Todas" ? "Todos los Platos" : selectedCategory}
            </Text>
  
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ff8403" />
              </View>
            ) : (
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {filteredProducts
                    .filter((item) => selectedCategory === "Todas" || item.categoria === selectedCategory)
                    .map((item) => renderItem({ item }))}
                </View>

            )}
          </View>
        </ScrollView>
      )}
  
      {/* Modal de producto */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          {selectedProduct && (
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Image source={{ uri: selectedProduct.imageUrl }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedProduct.nombre}</Text>
              <Text style={styles.modalDescription}>{selectedProduct.descripcion}</Text>
              <Text style={styles.modalIngredients}>Ingredientes: {selectedProduct.ingredientes}</Text>
            </View>
          )}
        </View>
      </Modal>
  
   
    </View>
  );
}  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 17,
    marginTop: 5,
    color: "#a8a7a2",
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  
  categoryButtonSelected: {
    backgroundColor: "#FBB03B",
  },
  
  categoryButtonUnselected: {
    backgroundColor: "transparent",
  },
  
  categoryText: {
    fontWeight: "600",
    fontSize: 16,
  },
  
  categoryTextSelected: {
    color: "#fff",
  },
  
  categoryTextUnselected: {
    color: "#aaa",
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
    width: "48%", // Cambio aquí
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "#F8F8F8",
    position: "relative",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  
  foodImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  cardInfo: {
    paddingTop: 10,
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
    flexDirection: "row",
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: "#FBB03B",
  },
  addButton: {
    position: "absolute",
    top:-8,
    right: -5,
    backgroundColor: "#ff8403",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    top: -2,
  },
  viewCartButton: {
    backgroundColor: "#ff8403",
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  viewCartText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cartSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  cartItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  clearButton: {
    backgroundColor: "#ff8403",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    position: "relative",
  },
  modalImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
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
  closeButton: {
    backgroundColor: "#aba7a7",
    position: "absolute",
    top: -10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  closeButtonText: {
    color: "#000000",
    fontWeight: "600",
  },
  cartCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cartCardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartCardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cartCardDetails: {
    flex: 1,
  },
  cartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 10,
    top:-5,
  },
  backButtonIcon: {
    fontSize: 22,
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  quantityButton: {
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  trashButton: {
    marginLeft: 10,
  },
  trashButtonText: {
    fontSize: 18,
  },
  fixedOrderButtonContainer: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
  },
  orderButton: {
    backgroundColor: "#ff8403",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    borderRadius: 20,
    

  },
  
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  cartIconButton: {
    position: "relative",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 9,
    elevation: 15,
  },
  
  cartIcon: {
    fontSize: 26,
  },
  
  cartCount: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#ff8403",
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  
  
  
});

export default HomeScreen;
