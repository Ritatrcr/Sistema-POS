// app/dashboardCliente.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./sidebar";
import { db } from "../../utils/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/authContext/AuthContext";

const DashboardCliente = () => {
  const router = useRouter();
  const { userName } = useAuth(); // Obtenemos el nombre del usuario
  const [search, setSearch] = useState("");
  const [platos, setPlatos] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Categorías que deseas mostrar
  const categories = ["Todas", "Platos Fuertes", "Bebidas", "Postres", "Entradas", "Ensaladas"];

  // Mapeo de imágenes locales. Agrega todas las imágenes que uses.
  const localPlatoImages: { [key: string]: any } = {
    "plato1.png": require("../../assets/images/platos/plato1.png"),
    "plato2.png": require("../../assets/images/platos/plato2.png"),
 
    // Agrega más imágenes según las necesites.
  };

  // Función para obtener la fuente de la imagen (local o remota)
  const getImageSource = (imageKey: string) => {
    if (localPlatoImages[imageKey]) {
      return localPlatoImages[imageKey];
    }
    // Si no se encuentra en el objeto, se asume que es una URL remota.
    return { uri: imageKey };
  };

  // Obtener todos los platos de la colección "platos" de Firestore
  useEffect(() => {
    const fetchPlatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "platos"));
        const platosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlatos(platosData);
      } catch (error) {
        console.error("Error fetching platos:", error);
      }
    };

    fetchPlatos();
  }, []);

  // Filtrar platos según la categoría seleccionada y el texto de búsqueda
  const filteredPlatos = platos.filter((plato) => {
    const categoryMatch = selectedCategory === "Todas" || plato.type === selectedCategory;
    const searchMatch =
      plato.name.toLowerCase().includes(search.toLowerCase()) ||
      plato.description.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello {userName || "Guest"}</Text>
          <Text style={styles.question}>¿De qué tienes antojos hoy?</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Escribe para buscar"
            value={search}
            onChangeText={setSearch}
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
          <Text style={styles.sectionTitle}>
            {selectedCategory === "Todas" ? "Todos los Platos" : selectedCategory}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredPlatos.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image
                  source={getImageSource(item.image)}
                  style={styles.foodImage}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    {item.time} mins - {item.type}
                  </Text>
                  <Text style={styles.itemRating}>{item.rating} ⭐</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Sección de Recomendados */}
        <View style={styles.foodSection}>
          <Text style={styles.sectionTitle}>Recomendados</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredPlatos
              .filter((plato) => plato.rating >= 4.5)
              .map((item) => (
                <View key={item.id} style={styles.card}>
                  <Image
                    source={getImageSource(item.image)}
                    style={styles.foodImage}
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetails}>
                      {item.description} - {item.time} mins
                    </Text>
                    <Text style={styles.itemRating}>{item.rating} ⭐</Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Sidebar al final */}
      <Sidebar />
    </View>
  );
};

export default DashboardCliente;

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
    fontSize: 14,
    color: "#FBB03B",
    marginTop: 5,
  },
});
