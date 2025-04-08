import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useProduct } from '../../../context/productsContext/ProductsContext';

const ProductListScreen = () => {
  const { products, fetchAllProducts } = useProduct();

  useEffect(() => {
    // Llamada a la función para obtener todos los productos
    fetchAllProducts();
  }, []);

  // Función para renderizar cada producto y sus pasos
  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{item.nombre}</Text>
      <Text style={styles.productPrice}>${item.precio}</Text>

      {/* Mostrar los pasos del producto */}
      <View style={styles.stepsContainer}>
        {item.pasos.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <Text style={styles.stepTitle}>Paso {index + 1}: {step}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Lista de Productos</Text>
      {/* FlatList para mostrar la lista de productos */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f1f1f1',
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
  },
  stepsContainer: {
    marginTop: 10,
  },
  stepCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 5,
    borderRadius: 6,
    width: '100%',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProductListScreen;
