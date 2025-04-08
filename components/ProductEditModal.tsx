import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useProduct } from "../context/productsContext/ProductsContext"; // Usar el contexto de productos
import { Entypo } from "@expo/vector-icons";
import CameraModal from "../components/cameramodal"; // Modal para seleccionar la imagen

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

interface ProductEditModalProps {
  product: Product;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ product, setSelectedProduct }) => {
  const [name, setName] = useState(product.nombre);
  const [descripcion, setDescripcion] = useState(product.descripcion);
  const [ingredientes, setIngredientes] = useState(product.ingredientes);
  const [precio, setPrecio] = useState(product.precio.toString());
  const [image, setImage] = useState<string | null>(product.imageUrl); // Para la imagen
  const [message, setMessage] = useState<string>("");

  const { updateProduct, deleteProduct } = useProduct();  // Usar el método de actualizar y eliminar productos del contexto
  const [isModalVisible, setIsModalVisible] = useState(false); // Para controlar la visibilidad del modal de la cámara

  const handleSave = async () => {
    try {
      // Actualizar el producto con los nuevos datos
      await updateProduct(product.id, {
        ...product,
        nombre: name,
        descripcion,
        ingredientes,
        precio: parseFloat(precio),
        imageUrl: image ?? "", // Si no se selecciona una imagen, se pasa una cadena vacía
      });

      setMessage("Producto modificado");
      setSelectedProduct(null); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar el producto: ", error);
    }
  };

  const handleImageSelect = (uri: string) => {
    setImage(uri); // Guardar la imagen seleccionada
    setIsModalVisible(false); // Cerrar el modal
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id); // Eliminar el producto usando el contexto
      setMessage("Producto eliminado");
      setSelectedProduct(null); // Cierra el modal después de eliminar
    } catch (error) {
      console.error("Error al eliminar el producto: ", error);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Producto</Text>

          {/* Campo para la imagen */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => setIsModalVisible(true)}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <>
                <Entypo name="camera" size={24} color="black" />
                <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Campos de texto con los valores actuales del producto */}
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={product.nombre}
          />
          <TextInput
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder={product.descripcion}
          />
          <TextInput
            style={styles.input}
            value={ingredientes}
            onChangeText={setIngredientes}
            placeholder={product.ingredientes}
          />
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            placeholder={product.precio.toString()}
            keyboardType="numeric"
          />

          {/* Mostrar mensaje después de la actualización */}
          {message ? <Text style={styles.successMessage}>{message}</Text> : null}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Editar</Text>
          </TouchableOpacity>

          {/* Botón de eliminar producto */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Eliminar Producto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedProduct(null)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de la cámara para seleccionar imagen */}
      <CameraModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} setImage={handleImageSelect} />
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  imageButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 200,
    height: 200,
    backgroundColor: '#FBB03B',
    padding: 5,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 150,
    resizeMode: 'cover',
  },
  imageButtonText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  successMessage: {
    color: "green",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#FF8403",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF4040",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FF8403",
    fontWeight: "600",
  },
});

export default ProductEditModal;
