import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useOrder } from "../../../context/orderContext/OrderContext";
import { useAuth } from "../../../context/authContext/AuthContext";
import { useProduct } from "../../../context/productsContext/ProductsContext";
import { useFocusEffect } from "expo-router";
import DetallesOrdenModal from "@/components/DetallesOrdenModal";

const VerOrdenesCliente = () => {
  const { orders, fetchAllOrders } = useOrder();
  const { products } = useProduct();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      fetchAllOrders();
    }, [])
  );

  if (!user) return <Text>No estás autenticado.</Text>;

  const ordenesUsuario = orders.filter((o: any) => o.userId === user.uid);
  const ordenesActivas = ordenesUsuario.filter((o: any) => o.estado !== "finalizado");
  const ordenesFinalizadas = ordenesUsuario.filter((o: any) => o.estado === "finalizado");

  const getEstadoEstilo = (estado: string) => {
    switch (estado) {
      case "ordenado": return { color: "#3498db", icon: "📝" };
      case "cocinando": return { color: "#e67e22", icon: "👨‍🍳" };
      case "Listo para recoger": return { color: "#f1c40f", icon: "📦" };
      case "entregado": return { color: "#2ecc71", icon: "✅" };
      case "listo para pago": return { color: "#9b59b6", icon: "💳" };
      case "finalizado": return { color: "#34495e", icon: "🏁" };
      case "cancelado": return { color: "#e74c3c", icon: "❌" };
      default: return { color: "#7f8c8d", icon: "❓" };
    }
  };

  
  const openModal = (order: any) => {
    const productosEnOrden = order.producto.map((p: any) => {
      const producto = products.find((prod: any) => prod.id === p.idProducto);
      return {
        ...p,
        nombre: producto?.nombre || "Producto desconocido",
        precio: producto?.precio || 0,
        imageUrl: producto?.imageUrl || "https://via.placeholder.com/60"
      };
    });

    setSelectedOrder({ ...order, producto: productosEnOrden });
    setModalVisible(true);
  };

  // Calcular progreso de la orden
  const getProgreso = (estado: string) => {
    const statusOrder = ["ordenado", "cocinando", "Listo para recoger", "entregado"];
    const currentStep = statusOrder.indexOf(estado) + 1;
    return (currentStep / statusOrder.length) * 100; // Progreso en porcentaje
  };

  return (
    
    <View style={styles.wrapper}>
              <Text style={styles.title}>Orden En Curso</Text>
      <ScrollView style={styles.container}>
        {ordenesActivas.map((orden: any, idx: number) => {
          const { color, icon } = getEstadoEstilo(orden.estado);
          return (
            <TouchableOpacity key={idx} style={styles.card} onPress={() => openModal(orden)}>
              <Text style={styles.estado}>
                Estado: <Text style={{ color }}>{icon} {orden.estado}</Text>
              </Text>
              <Text>Total: ${orden.precioTotal}</Text>
              <Text>Fecha: {orden.fechaRealizacion}</Text>
              <Text>Hora: {orden.horaRealizacion}</Text>
              {/* Mostrar productos y cantidades */}
              <View style={styles.productList}>
                
              </View>

              {/* Barra de progreso */}
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${getProgreso(orden.estado)}%` }]} />
              </View>

              {/* Círculos sobre la barra de progreso */}
              <View style={styles.progressStepContainer}>
                {["ordenado", "cocinando", "Listo para recoger", "entregado"].map((estado, index) => (
                  <View key={estado} style={styles.progressStep}>
                    <View
                      style={[
                        styles.circle,
                        getProgreso(orden.estado) >= (index + 1) * 25 ? styles.activeCircle : null,
                      ]}
                    >
                      <Text style={styles.circleText}>{index + 1}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.title}>Ordenes Anteriores</Text>
        {ordenesFinalizadas.length === 0 ? (
          <Text style={styles.empty}>No tienes órdenes anteriores</Text>
        ) : (
          ordenesFinalizadas.map((orden: any, idx: number) => {
            const { color, icon } = getEstadoEstilo(orden.estado);
            return (
              <TouchableOpacity key={idx} style={styles.card} onPress={() => openModal(orden)}>
                <Text style={styles.estado}>
                  Estado: <Text style={{ color }}>{icon} {orden.estado}</Text>
                </Text>
                <Text>Total: ${orden.precioTotal}</Text>
                <Text>Fecha: {orden.fechaRealizacion}</Text>
                <Text>Hora: {orden.horaRealizacion}</Text>
                



                {/* Barra de progreso */}
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${getProgreso(orden.estado)}%` }]} />
                </View>

                {/* Círculos sobre la barra de progreso */}
                <View style={styles.progressStepContainer}>
                  {["ordenado", "cocinando", "Listo para recoger", "entregado"].map((estado, index) => (
                    <View key={estado} style={styles.progressStep}>
                      <View
                        style={[
                          styles.circle,
                          getProgreso(orden.estado) >= (index + 1) * 25 ? styles.activeCircle : null,
                        ]}
                      >
                        <Text style={styles.circleText}>{index + 1}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <DetallesOrdenModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedOrder={selectedOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estado: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  empty: {
    color: "gray",
    fontStyle: "italic",
    marginBottom: 10,
  },
  productList: {
    marginTop: 10,
  },
  productDetails: {
    paddingVertical: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressBarContainer: {
    marginTop: 10,
    height: 5,
    width: "100%",
    backgroundColor: "#EAEAEA",
    borderRadius: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FBB03B",
    borderRadius: 5,
  },
  progressStepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressStep: {
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
  },
  circle: {
    position: "absolute",
    top: -25,
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
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  bold: {
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ff8403",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default VerOrdenesCliente;