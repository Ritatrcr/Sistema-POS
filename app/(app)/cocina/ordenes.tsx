import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Picker, ScrollView } from "react-native";
import { useOrder } from "../../../context/orderContext/OrderContext";
import { useProduct } from "../../../context/productsContext/ProductsContext";
import { Ionicons } from "@expo/vector-icons";

const ProductosEnOrdenesScreen = () => {
  const { orders } = useOrder();
  const { products } = useProduct();
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: { ordenado: number, cocinando: number } }>({});
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("todos");

  useEffect(() => {
    // Calcular las cantidades de productos en las órdenes con los estados "ordenado" y "cocinando"
    const updatedQuantities: { [key: string]: { ordenado: number, cocinando: number } } = {};

    orders.forEach((order) => {
      order.producto.forEach((item) => {
        const productId = item.idProducto;
        if (!updatedQuantities[productId]) {
          updatedQuantities[productId] = { ordenado: 0, cocinando: 0 };
        }

        if (order.estado === "ordenado") {
          updatedQuantities[productId].ordenado += item.cantidad;
        } else if (order.estado === "cocinando") {
          updatedQuantities[productId].cocinando += item.cantidad;
        }
      });
    });

    setProductQuantities(updatedQuantities);
  }, [orders]);

  useEffect(() => {
    // Filtrar los productos por categoría seleccionada
    if (selectedCategory === "todos") {
      setFilteredProducts(products); // Mostrar todos los productos
    } else {
      setFilteredProducts(products.filter(product => product.categoria === selectedCategory)); // Filtrar por categoría
    }
  }, [selectedCategory, products]);

  const renderProductRow = (item) => {
    const quantityOrdered = productQuantities[item.id]?.ordenado || 0;
    const quantityCooking = productQuantities[item.id]?.cocinando || 0;

    return (
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>{item.nombre}</Text>
        <Text style={styles.tableCell}>{item.categoria}</Text>
        <Text style={styles.tableCell}>{quantityOrdered}</Text>
        <Text style={styles.tableCell}>{quantityCooking}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>  {/* Agregar ScrollView aquí */}
      <Text style={styles.title}>Informe de Productos en Órdenes</Text>

      {/* Filtro por Categoría */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por Categoría:</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)} // Actualizar la categoría seleccionada
        >
          <Picker.Item label="Todos" value="todos" />
          <Picker.Item label="Plato Fuerte" value="plato fuerte" />
          <Picker.Item label="Entrada" value="entrada" />
          <Picker.Item label="Bebida" value="bebida" />
          <Picker.Item label="Postre" value="postre" />
        </Picker>
      </View>

      {products.length === 0 ? (
        <ActivityIndicator size="large" color="#FBB03B" />
      ) : (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Producto</Text>
            <Text style={styles.tableHeaderCell}>Categoría</Text>
            <Text style={styles.tableHeaderCell}>Ordenado</Text>
            <Text style={styles.tableHeaderCell}>Cocinando</Text>
          </View>
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => renderProductRow(item)}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </ScrollView>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  filterContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderColor: "#EAEAEA",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#FBB03B",
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
});

export default ProductosEnOrdenesScreen;
