import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from "react-native";
import { useOrder } from "../../../context/orderContext/OrderContext";
import { useAuth } from "../../../context/authContext/AuthContext";
import { useProduct } from "../../../context/productsContext/ProductsContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";



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

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Orden En Curso</Text>
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
            </TouchableOpacity>
          );
        })}

        <Text style={styles.title}>Ordenes Finalizadas</Text>
        {ordenesFinalizadas.length === 0 ? (
          <Text style={styles.empty}>No tienes órdenes finalizadas</Text>
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
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalle de la Orden</Text>
          {selectedOrder && (
            <View>
              <Text style={styles.bold}>ID:</Text> <Text>{selectedOrder.id}</Text>
              <Text style={styles.bold}>Estado:</Text> <Text>{selectedOrder.estado}</Text>
              <Text style={styles.bold}>Total:</Text> <Text>${selectedOrder.precioTotal}</Text>
              <Text style={styles.bold}>Fecha:</Text> <Text>{selectedOrder.fechaRealizacion}</Text>
              <Text style={styles.bold}>Hora inicio:</Text> <Text>{selectedOrder.horaRealizacion}</Text>
              <Text style={styles.bold}>Hora fin:</Text> <Text>{selectedOrder.horaFinalizacion || "-"}</Text>
              <Text style={[styles.modalTitle, { fontSize: 18, marginTop: 20 }]}>Productos</Text>
              {selectedOrder.producto.map((p: any, i: number) => (
                <View key={i} style={styles.productCard}>
                  <Image source={{ uri: p.imageUrl }} style={styles.productImage} />
                  <View style={styles.productDetails}>
                    <Text style={styles.bold}>Nombre:</Text> <Text>{p.nombre}</Text>
                    <Text style={styles.bold}>Precio:</Text> <Text>${p.precio}</Text>
                    <Text style={styles.bold}>Cantidad:</Text> <Text>{p.cantidad}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={{ color: "white" }}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>

       
      </Modal>

    
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
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
  productCard: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
});

export default VerOrdenesCliente;