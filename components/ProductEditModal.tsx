import React, { useState } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from "react-native";
import { useProduct } from "../context/productsContext/ProductsContext"; 
import { Entypo } from "@expo/vector-icons";
import CameraModal from "../components/cameramodal";

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
  const [tiempoPreparacion, setTiempoPreparacion] = useState(product.tiempoPreparacion);
  const [categoria, setCategoria] = useState(product.categoria);
  // Convertir el arreglo de pasos a un string, separando cada paso por salto de línea.
  const [pasos, setPasos] = useState(product.pasos.join("\n"));
  const [precio, setPrecio] = useState(product.precio.toString());
  const [image, setImage] = useState<string | null>(product.imageUrl);
  const [message, setMessage] = useState<string>("");

  const { updateProduct, deleteProduct } = useProduct();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSave = async () => {
    try {
      // Convertir el string de "pasos" en un arreglo, eliminando líneas vacías
      const pasosArray = pasos
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);

      await updateProduct(product.id, {
        ...product,
        nombre: name,
        descripcion,
        ingredientes,
        precio: parseFloat(precio),
        imageUrl: image ?? "",
        tiempoPreparacion,
        categoria,
        pasos: pasosArray,
      });

      setMessage("Producto modificado");
      setSelectedProduct(null); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar el producto: ", error);
    }
  };

  const handleImageSelect = (uri: string) => {
    setImage(uri);
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      setMessage("Producto eliminado");
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error al eliminar el producto: ", error);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Producto</Text>

          {/* Botón para seleccionar imagen */}
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

          {/* Nombre */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Nombre:</Text>
            <TextInput
              style={styles.inputRowInput}
              value={name}
              onChangeText={setName}
              placeholder="Nombre del producto"
            />
          </View>

          {/* Descripción */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Descripción:</Text>
            <TextInput
              style={styles.inputRowInput}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción"
            />
          </View>

          {/* Ingredientes */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Ingredientes:</Text>
            <TextInput
              style={styles.inputRowInput}
              value={ingredientes}
              onChangeText={setIngredientes}
              placeholder="Ingredientes"
            />
          </View>

          {/* Categoría */}
          <Text style={styles.inputLabel}>Categoría:</Text>
          <View style={styles.row}>
            {["Platos Fuertes", "Bebidas", "Postres", "Entrada"].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  categoria === cat && styles.categoryButtonSelected,
                ]}
                onPress={() => setCategoria(cat)}
              >
                <Text>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tiempo de preparación */}
          <Text style={styles.inputLabel}>Tiempo de preparación:</Text>
          <View style={styles.row}>
            {["15", "20", "30"].map((timeValue) => (
              <TouchableOpacity
                key={timeValue}
                style={[
                  styles.timeButton,
                  tiempoPreparacion === `${timeValue} min` && styles.timeButtonSelected,
                ]}
                onPress={() => setTiempoPreparacion(`${timeValue} min`)}
              >
                <Text>{`${timeValue} min`}</Text>
              </TouchableOpacity>
            ))}
            {/* Input personalizado */}
            <TextInput
              style={[styles.inputRowInput, { width: 80, marginLeft: 10 }]}
              value={
                !["15 min", "20 min", "30 min"].includes(tiempoPreparacion) 
                  ? tiempoPreparacion.replace(" min", "")
                  : ""
              }
              onChangeText={(text) => {
                // Si se ingresa texto, actualizamos el valor concatenando " min"
                if(text) {
                  setTiempoPreparacion(`${text} min`);
                } else {
                  setTiempoPreparacion("");
                }
              }}
              placeholder="Otro"
              keyboardType="numeric"
            />
          </View>

          {/* Pasos */}
          <View style={[styles.inputRow, { alignItems: "flex-start" }]}>
            <Text style={styles.inputLabel}>Pasos:</Text>
            <TextInput
              style={[styles.inputRowInput, { height: 80 }]}
              value={pasos}
              onChangeText={setPasos}
              placeholder="Cada paso en una nueva línea"
              multiline
            />
          </View>

          {/* Precio */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Precio:</Text>
            <TextInput
              style={styles.inputRowInput}
              value={precio}
              onChangeText={setPrecio}
              placeholder="Precio"
              keyboardType="numeric"
            />
          </View>

          {message ? <Text style={styles.successMessage}>{message}</Text> : null}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Eliminar Producto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedProduct(null)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para seleccionar imagen (cámara/galería) */}
      <CameraModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        setImage={handleImageSelect}
      />
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
    borderRadius: 20,
    width: 700,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  imageButton: {
    marginLeft: "auto",
    marginRight: "auto",
    width: 200,
    height: 200,
    backgroundColor: "#FBB03B",
    padding: 5,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 150,
    resizeMode: "cover",
  },
  imageButtonText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  // Estilos para inputs en fila
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    width: 100,
  },
  inputRowInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#ececec",
    marginRight: 5,
    marginBottom: 5,
  },
  categoryButtonSelected: {
    backgroundColor: "#FF8403",
  },
  timeButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#ececec",
    marginRight: 5,
    marginBottom: 5,
  },
  timeButtonSelected: {
    backgroundColor: "#FF8403",
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
