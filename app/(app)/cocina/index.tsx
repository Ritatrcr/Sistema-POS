import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal } from "react-native";
import { useOrder } from "../../../context/orderContext/OrderContext"; // Usamos el contexto de órdenes
import { useProduct } from "../../../context/productsContext/ProductsContext"; // Usamos el contexto de productos
import { Ionicons } from "@expo/vector-icons"; // Para los íconos

const CocinaScreen = () => {
  const { orders, updateOrderStatus, fetchAllOrders } = useOrder();
  const { fetchProductById } = useProduct(); // Hook para obtener productos
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [productsNames, setProductsNames] = useState<{ [key: string]: string }>({}); // Para almacenar los nombres de los productos
  const [loading, setLoading] = useState<boolean>(false); // Estado para el loader
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Para almacenar la orden seleccionada
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Para controlar la visibilidad del modal
  const [selectedStatus, setSelectedStatus] = useState<string>("todos"); // Estado para el filtro por estado

  // Ordenamos las órdenes por fecha y hora de realización
  useEffect(() => {
    setLoading(true); // Iniciamos el loader
    const sorted = [...orders].sort((a, b) => {
      const aDate = new Date(`${a.fechaRealizacion} ${a.horaRealizacion}`);
      const bDate = new Date(`${b.fechaRealizacion} ${b.horaRealizacion}`);
      return aDate - bDate; // Ordenar cronológicamente
    });
    setSortedOrders(sorted);
    setLoading(false); // Detenemos el loader
  }, [orders]);

  // Filtrar órdenes por estado
  useEffect(() => {
    if (selectedStatus === "todos") {
      setFilteredOrders(sortedOrders);
    } else {
      setFilteredOrders(sortedOrders.filter(order => order.estado === selectedStatus));
    }
  }, [selectedStatus, sortedOrders]);

  // Obtener el nombre del producto por idProducto
  const getProductName = async (idProducto: string) => {
    if (!productsNames[idProducto]) {
      const product = await fetchProductById(idProducto);
      if (product) {
        setProductsNames((prevState) => ({
          ...prevState,
          [idProducto]: product.nombre, // Guardamos el nombre del producto
        }));
      }
    }
  };

  // Cambiar el estado de la orden
  const handleOrderStatusChange = async (orderId: string, newStatus: "cocinando" | "Listo para recoger" | "entregado") => {
    setLoading(true); // Iniciamos el loader mientras cambiamos el estado
    await updateOrderStatus(orderId, newStatus);
    await fetchAllOrders(); // Volvemos a traer todas las órdenes después de actualizar el estado
    setLoading(false); // Detenemos el loader
  };

  // Mostrar los detalles de una orden
  const handleOrderDetails = (order: Order) => {
    setSelectedOrder(order); // Establecer la orden seleccionada
    setModalVisible(true); // Mostrar el modal
  };

  // Cerrar el modal
  const closeModal = () => {
    setModalVisible(false); // Ocultar el modal
    setSelectedOrder(null); // Limpiar la orden seleccionada
  };

  // Renderizamos cada orden
  const renderOrderItem = ({ item }: any) => (
    <View style={[styles.orderCard, item.estado === "ordenado" ? styles.newOrder : null]}>
      <Text style={styles.orderTitle}>Orden ID: {item.id}</Text>
      <Text style={styles.orderDate}>Fecha: {item.fechaRealizacion}</Text>
      <Text style={styles.orderTime}>Hora: {item.horaRealizacion}</Text>
      
      {/* Mostrar productos de la orden con el nombre en lugar del id */}
      {item.producto.map((producto: any, index: number) => {
        getProductName(producto.idProducto); // Llamar para obtener el nombre del producto
        return (
          <Text key={index} style={styles.productText}>
            {productsNames[producto.idProducto] || "Sin nombre"} - Cantidad: {producto.cantidad}
          </Text>
        );
      })}

      <Text style={styles.orderStatus}>Estado: {item.estado}</Text>

      {/* Botones para cambiar el estado de la orden */}
      {item.estado === "ordenado" && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleOrderStatusChange(item.id, "cocinando")}
        >
          <Text style={styles.buttonText}>Comenzar a cocinar</Text>
        </TouchableOpacity>
      )}
      {item.estado === "cocinando" && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleOrderStatusChange(item.id, "Listo para recoger")}
        >
          <Text style={styles.buttonText}>Listo para recoger</Text>
        </TouchableOpacity>
      )}
      {item.estado === "Listo para recoger" && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleOrderStatusChange(item.id, "entregado")}
        >
          <Text style={styles.buttonText}>Entregar</Text>
        </TouchableOpacity>
      )}

      {/* Ver detalles de la orden (Ícono en la parte superior derecha) */}
      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => handleOrderDetails(item)}
      >
        <Ionicons name="eye-outline" color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );

  // Renderizamos los detalles de la orden en un modal
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
    return (
      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={true} 
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Detalles de la orden</Text>
            {selectedOrder.producto.map((producto: any, index: number) => (
              <View key={index} style={styles.productCard}>
                <Text style={styles.productName}>{productsNames[producto.idProducto] || "Sin nombre"}</Text>
                <Text>Cantidad: {producto.cantidad}</Text>
              </View>
            ))}
            
            {/* Mostrar el proceso de la orden */}
            <View style={styles.processContainer}>
              {["ordenado", "cocinando", "Listo para recoger", "entregado"].map((estado, index) => (
                <View key={estado} style={styles.processStep}>
                  <View 
                    style={[
                      styles.circle, 
                      selectedOrder.estado === estado ? styles.activeCircle : null
                    ]}
                  >
                    <Text style={styles.circleText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.processText}>{estado}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Órdenes de Cocina</Text>

      {/* Botones con íconos para cambiar el filtro */}
      <View style={styles.filterButtonsContainer}>
        {["todos", "ordenado", "cocinando", "Listo para recoger", "entregado"].map((estado, index) => (
          <TouchableOpacity
            key={estado}
            style={[
              styles.filterButton,
              selectedStatus === estado && styles.selectedFilterButton
            ]}
            onPress={() => setSelectedStatus(estado)}
          >
            <Ionicons
              name={
                estado === "todos" ? "list-outline" :
                estado === "ordenado" ? "clipboard-outline" :
                estado === "cocinando" ? "restaurant-outline" :
                estado === "Listo para recoger" ? "checkmark-circle-outline" :
                "checkmark-done-outline"
              }
              size={24}
              color="#fff"
            />
            <Text style={styles.filterButtonText}>{estado}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mostrar loader mientras se están obteniendo las órdenes */}
      {loading ? (
        <ActivityIndicator size="large" color="#FBB03B" />
      ) : (
        <>
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
          />
          {renderOrderDetails()}
        </>
      )}
    </View>
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
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#FBB03B",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedFilterButton: {
    backgroundColor: "#E57E1B", // Resaltar el estado seleccionado
  },
  filterButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    position: "relative",
  },
  newOrder: {
    borderColor: "#FBB03B", // Resaltar las órdenes nuevas
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderTime: {
    fontSize: 14,
    color: "#666",
  },
  productText: {
    fontSize: 14,
    color: "#333",
  },
  orderStatus: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#FBB03B",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  detailsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FBB03B",
    borderRadius: 50,
    padding: 8,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderColor: "#EAEAEA",
    borderWidth: 1,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  productCard: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  processContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  processStep: {
    alignItems: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  activeCircle: {
    backgroundColor: "#FBB03B", // Resaltar el estado activo
  },
  circleText: {
    color: "#FFF",
    fontWeight: "600",
  },
  processText: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FBB03B",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default CocinaScreen;
