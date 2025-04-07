import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal } from "react-native";
import { useOrder } from "../../../context/orderContext/OrderContext";
import { useProduct } from "../../../context/productsContext/ProductsContext";
import { Ionicons } from "@expo/vector-icons";
const CocinaScreen = () => {
  const { orders, updateOrderStatus, fetchAllOrders } = useOrder();
  const { fetchProductById } = useProduct();
  const [sortedOrders, setSortedOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [productsNames, setProductsNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [viewOrders, setViewOrders] = useState(false);

  useEffect(() => {
    setLoading(true);
    const sorted = [...orders].sort((a, b) => new Date(`${a.fechaRealizacion} ${a.horaRealizacion}`) - new Date(`${b.fechaRealizacion} ${b.horaRealizacion}`));
    setSortedOrders(sorted);
    setLoading(false);
  }, [orders]);

  useEffect(() => {
    if (selectedStatus === "todos") {
      setFilteredOrders(sortedOrders);
    } else {
      setFilteredOrders(sortedOrders.filter(order => order.estado === selectedStatus));
    }
  }, [selectedStatus, sortedOrders]);

  const getProductName = async (idProducto) => {
    if (!productsNames[idProducto]) {
      const product = await fetchProductById(idProducto);
      if (product) {
        setProductsNames(prevState => ({ ...prevState, [idProducto]: product.nombre }));
      }
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    await updateOrderStatus(orderId, newStatus);
    await fetchAllOrders();
    setLoading(false);
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderCard, item.estado === "ordenado" ? styles.newOrder : null]}>
      <Text style={styles.orderTitle}>Orden ID: {item.id}</Text>
      <Text style={styles.orderDate}>Fecha: {item.fechaRealizacion}</Text>
      <Text style={styles.orderTime}>Hora: {item.horaRealizacion}</Text>
      
      {item.producto.map((producto, index) => {
        getProductName(producto.idProducto);
        return <Text key={index} style={styles.productText}>{productsNames[producto.idProducto] || "Sin nombre"} - Cantidad: {producto.cantidad}</Text>;
      })}

      <Text style={styles.orderStatus}>Estado: {item.estado}</Text>

      {item.estado === "ordenado" && (
        <TouchableOpacity style={styles.button} onPress={() => handleOrderStatusChange(item.id, "cocinando")}>
          <Text style={styles.buttonText}>Comenzar a cocinar</Text>
        </TouchableOpacity>
      )}
      {item.estado === "cocinando" && (
        <TouchableOpacity style={styles.button} onPress={() => handleOrderStatusChange(item.id, "Listo para recoger")}>
          <Text style={styles.buttonText}>Listo para recoger</Text>
        </TouchableOpacity>
      )}
      {item.estado === "Listo para recoger" && (
        <TouchableOpacity style={styles.button} onPress={() => handleOrderStatusChange(item.id, "entregado")}>
          <Text style={styles.buttonText}>Entregar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.detailsButton} onPress={() => handleOrderDetails(item)}>
        <Ionicons name="eye-outline" color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
    return (
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Detalles de la orden</Text>
            {selectedOrder.producto.map((producto, index) => (
              <View key={index} style={styles.productCard}>
                <Text style={styles.productName}>{productsNames[producto.idProducto] || "Sin nombre"}</Text>
                <Text>Cantidad: {producto.cantidad}</Text>
              </View>
            ))}
            
            <View style={styles.processContainer}>
              {["ordenado", "cocinando", "Listo para recoger", "entregado"].map((estado, index) => (
                <View key={estado} style={styles.processStep}>
                  <View style={[styles.circle, selectedOrder.estado === estado ? styles.activeCircle : null]}>
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

  const renderButtonsState = () => {
    return (
      <View style={styles.filterButtonsContainer}>
        {["todos", "ordenado", "cocinando", "Listo para recoger", "entregado"].map((estado) => (
          <TouchableOpacity key={estado} style={[styles.filterButton, selectedStatus === estado && styles.selectedFilterButton]} onPress={() => { setSelectedStatus(estado); setViewOrders(true); }}>
            <Ionicons name={estado === "todos" ? "list-outline" : estado === "ordenado" ? "clipboard-outline" : estado === "cocinando" ? "restaurant-outline" : estado === "Listo para recoger" ? "checkmark-circle-outline" : "checkmark-done-outline"} size={24} color="#fff" />
            <Text style={styles.filterButtonText}>{estado}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderOrdersByState = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => setViewOrders(false)}>
          <Ionicons name="arrow-back-outline" size={24} color="#080808" />
        </TouchableOpacity>
        <Text style={styles.title}>{selectedStatus}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FBB03B" />
        ) : (
          <FlatList data={filteredOrders} renderItem={renderOrderItem} keyExtractor={(item) => item.id} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!viewOrders ? renderButtonsState() : renderOrdersByState()}
      {renderOrderDetails()}
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
    flexWrap: "wrap", // Permite que los botones se ajusten si hay más de 2 en la fila
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#FBB03B",
    width: "48%",  // Esto hace que cada botón ocupe el 48% del ancho, dejando espacio entre ellos
    marginBottom: 10,
    paddingVertical: 20,  // Aumenta el espacio vertical
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column", // Icono arriba y texto abajo
  },
  selectedFilterButton: {
    backgroundColor: "#E57E1B",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,  // Espacio entre el icono y el texto
  },
  filterButtonIcon: {
    fontSize: 30, // Tamaño del icono
    color: "#fff",
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
    borderColor: "#FBB03B",
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
    backgroundColor: "#FBB03B",
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
