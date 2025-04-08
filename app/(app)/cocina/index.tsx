import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal, Image } from "react-native";
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

  const renderOrderItem = ({ item }) => {
    const index = sortedOrders.findIndex((order) => order.id === item.id);
    return (
      <View style={[styles.orderCard, item.estado === "ordenado" ? styles.newOrder : null]}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>Orden ID: {index + 1}</Text>
          {item.estado === "ordenado" && <Text style={styles.newTag}>NUEVO</Text>}
        </View>

        <Text style={styles.orderDate}>Fecha: {item.fechaRealizacion}</Text>
        <Text style={styles.orderTime}>Hora: {item.horaRealizacion}</Text>
        
        {item.producto.map((producto, index) => {
          getProductName(producto.idProducto);
          return <Text key={index} style={styles.productText}>{producto.cantidad}-{productsNames[producto.idProducto] || "Sin nombre"}  </Text>;
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
          <Ionicons name="eye-outline" color="#FBB03B" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
    return (
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Detalles de la orden</Text>
            
            {/* Mostrar el card para cada producto */}
            {selectedOrder.producto.map((producto, index) => (
              <View key={index} style={styles.productCard}>
                <Image
                  source={{ uri: producto.imageUrl }}  // Asegúrate de que el producto tenga una propiedad 'imageUrl'
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{productsNames[producto.idProducto] || "Sin nombre"}</Text>
                  <Text style={styles.productQuantity}>Cantidad: {producto.cantidad}</Text>
                </View>
              </View>
            ))}
           <Text style={styles.orderStatus}>
              Estado: <Text style={[styles.statusText, { color: '#FBB03B', fontWeight: 'bold' }]}>
                {selectedOrder.estado}
              </Text>
            </Text>

            <View style={styles.processContainer}>
              {["ordenado", "cocinando", "Listo para recoger", "entregado"].map((estado, index) => (
                <View key={estado} style={styles.processStep}>
                 
                  <View style={[styles.circle, selectedOrder.estado === estado ? styles.activeCircle : null]}>
                    <Text style={styles.circleText}>{index + 1}</Text>
                  </View>
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

  const renderFilter = () => {
    return (
      <View style={styles.filterContainer}>
        {["todos", "ordenado", "cocinando", "Listo para recoger", "entregado"].map((status, index) => {
          const isSelected = selectedStatus === status;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                isSelected ? styles.filterButtonSelected : styles.filterButtonUnselected,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected ? styles.filterTextSelected : styles.filterTextUnselected,
                ]}
              >
                {status === "todos" ? "Todas" : status}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    
    <View style={styles.container}>
          <Text style={styles.title}>Ordenes</Text>

      {renderFilter()}
      {loading ? (
        <ActivityIndicator size="large" color="#FBB03B" />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
   filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "transparent",
  },
  filterButtonSelected: {
    backgroundColor: "#FBB03B",
  },
  filterButtonUnselected: {
    backgroundColor: "transparent",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "600",
  },
  filterTextSelected: {
    color: "#fff",
  },
  filterTextUnselected: {
    color: "#aaa",
  },
  alertCircle: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#90EE90",
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  alertText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "600",
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
    borderRadius: 50,
    padding: 8,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 30,
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderColor: "#EAEAEA",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,

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
  orderHeader: {
    flexDirection: 'row', // Alinear horizontalmente
    alignItems: 'center', // Centrar verticalmente
  },


  newTag: {
    backgroundColor: "#90EE90", // Color verde claro
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 10, // Espacio entre el ID y el tag "Nuevo"
  },
 
  
    productImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 15,
    },
    productInfo: {
      padding: 10,
    },
  
    productQuantity: {
      fontSize: 14,
      color: "#666",
    },
 
  
   
  });
  

export default CocinaScreen;
