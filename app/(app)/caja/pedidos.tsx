import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import DetallesOrdenModal from "../../../components/DetallesOrdenModal"; 
import PagoproductoModal from "../../../components/PagoproductoModal"; 

import { useOrder } from "../../../context/orderContext/OrderContext"; 
import { Picker } from "@react-native-picker/picker";
import { useProduct } from "../../../context/productsContext/ProductsContext"; 

const Pedidos = () => {
  const { orders, fetchAllOrders, updateOrderStatus } = useOrder(); 
  const { products } = useProduct(); 
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newState, setNewState] = useState<string>("");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("ordenado"); 


  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getEstadoEstilo = (estado: string) => {
    switch (estado) {
      case "ordenado":
        return { color: "#3498db", icon: "📝" };
      case "cocinando":
        return { color: "#e67e22", icon: "👨‍🍳" };
      case "Listo para recoger":
        return { color: "#f1c40f", icon: "📦" };
      case "entregado":
        return { color: "#2ecc71", icon: "✅" };
      case "listo para pago":
        return { color: "#9b59b6", icon: "💳" };
      case "finalizado":
        return { color: "#34495e", icon: "🏁" };
      case "cancelado":
        return { color: "#e74c3c", icon: "❌" };
      default:
        return { color: "#7f8c8d", icon: "❓" };
    }
  };

  // Filtrar las órdenes según el estado
  const handleFiltroEstado = (estado: string) => {
    setEstadoFiltro(estado); // Actualizamos el estado con el valor seleccionado en el Picker
  };

  const ordenesFiltradas = orders.filter((order: { estado: string }) => order.estado === estadoFiltro);

  // Filtrar las órdenes "Listo para pago"
  const ordenesListasParaPago = orders.filter((order: { estado: string }) => order.estado === "entregado");

  const openModal = (order: any) => {
    // Mapeamos los productos en la orden para agregarles detalles
    const productosEnOrden = order.producto.map((p: any) => {
      const producto = products.find((prod: any) => prod.id === p.idProducto);
      return {
        ...p,
        nombre: producto?.nombre || "Producto desconocido",
        precio: producto?.precio || 0,
        imageUrl: producto?.imageUrl || "https://via.placeholder.com/60",
      };
    });

    // Asignar la orden con los productos mapeados
    setSelectedOrder({ ...order, producto: productosEnOrden });
    setNewState(order.estado); // Pre-cargar el estado actual de la orden

    if (order.estado === "listo para pago") {
      setPaymentModalVisible(true); 
    } else {
      setModalVisible(true);  //si no, abrimos el modal de detalles
    }
  };

 

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Órdenes</Text>

      {/* Mostrar las órdenes listas para pago (mitad superior) */}
      <View style={styles.topHalf}>
        <Text style={styles.subtitle}>Órdenes Listas para Pagar</Text>
        <ScrollView style={styles.container}>
          {ordenesListasParaPago.length === 0 ? (
            <Text>No hay órdenes listas para pagar</Text>
          ) : (
            ordenesListasParaPago.map((orden: any, idx: number) => {
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
        
      </View >
      <View style={{ marginBottom: 100, marginTop: 20 }}>
      <Picker
          selectedValue={estadoFiltro}
          onValueChange={handleFiltroEstado} // Actualiza el estado cuando se cambia la selección
          style={styles.picker}
        >
          <Picker.Item label="Ordenado" value="ordenado" />
          <Picker.Item label="Cocinando" value="cocinando" />
          <Picker.Item label="Listo para recoger" value="Listo para recoger" />
          <Picker.Item label="Entregado" value="entregado" />
          <Picker.Item label="Listo para pago" value="listo para pago" />
          <Picker.Item label="Finalizado" value="finalizado" />
          <Picker.Item label="Cancelado" value="cancelado" />
        </Picker>
      </View>
     
      
      <ScrollView style={styles.bottomHalf}>
        
        <Text style={styles.subtitle}>Todas las Órdenes</Text>
      
        <Text style={styles.filtroText}>Filtrar or estado:</Text>
        

        {/* Mostrar las órdenes filtradas */}
        {ordenesFiltradas.length === 0 ? (
          <Text>No hay órdenes para mostrar</Text>
        ) : (
          ordenesFiltradas.map((orden: any, idx: number) => {
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
      

      <DetallesOrdenModal 
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedOrder={selectedOrder}
      />

      <PagoproductoModal
        modalVisible={paymentModalVisible}
        setModalVisible={setPaymentModalVisible}
        selectedOrder={selectedOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  topHalf: {
    flex: 1,  
    marginBottom: 10, 
  },
  bottomHalf: {
    flex: 1, 
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
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
  filtroText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
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
  picker: {
    height: 50, 
    width: "100%", 
    marginBottom: 20,
  },
});

export default Pedidos;
