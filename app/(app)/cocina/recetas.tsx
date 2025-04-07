import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useProduct } from '../../../context/productsContext/ProductsContext';
import { useRouter } from 'expo-router';

const ProductListScreen = () => {
  const { products } = useProduct();
  const router = useRouter();

  // Mostrar la lista de productos
  // Define the Product type
  interface Product {
    id: string;
    nombre: string;
    precio: number;
    imageUrl: string;
  }
  
  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`./product-details/${item.id}`)} // Navegar a los detalles del producto
    >
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{item.nombre}</Text>
      <Text style={styles.productPrice}>${item.precio}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const ProductDetailsScreen = ({ productId }: { productId: string }) => {
  const { fetchProductById } = useProduct();
  interface Product {
    id: string;
    nombre: string;
    precio: number;
    imageUrl: string;
    descripcion: string;
    pasos: string[];
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await fetchProductById(productId);
      setProduct(fetchedProduct);
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <Text>Cargando...</Text>;

  const handleNextStep = () => {
    if (currentStep < product.pasos.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Finalizar la visualización
    console.log('Receta terminada');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{product.nombre}</Text>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productDescription}>{product.descripcion}</Text>

      <Text style={styles.stepTitle}>Paso {currentStep + 1}: </Text>
      <Text style={styles.stepDescription}>{product.pasos[currentStep]}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handlePreviousStep} style={styles.button}>
          <Text style={styles.buttonText}>Retroceder</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextStep} style={styles.button}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
        <Text style={styles.finishButtonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
};

export { ProductListScreen, ProductDetailsScreen };

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
  productDescription: {
    fontSize: 14,
    marginVertical: 10,
    color: '#555',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  stepDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#FBB03B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
