import React, { useState } from 'react';
import { Modal, ScrollView, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useOrder } from '../context/orderContext/OrderContext';
import ReciboProductoModal from '../components/ReciboProductoModal';

interface Product {
  imageUrl: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Order {
  id: string;
  estado: string;
  precioTotal: number;
  fechaRealizacion: string;
  horaRealizacion: string;
  horaFinalizacion?: string;
  producto: Product[];
}

interface DetallesOrdenModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOrder: Order | null;
}

const PagoproductoModal: React.FC<DetallesOrdenModalProps> = ({ modalVisible, setModalVisible, selectedOrder }) => {
  const { updateOrderStatus } = useOrder();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const precio = selectedOrder?.precioTotal || 0;
  const impuesto = precio * 0.19;
  const total = precio + impuesto;

  const handleOrderPaid = async () => {
    if (selectedOrder) {
      try {
        await updateOrderStatus(selectedOrder.id, 'finalizado');
        setShowReceiptModal(true); // Mostrar el modal de recibo después de pagar la orden
      } catch (error) {
        console.error('Error al actualizar la orden: ', error);
      }
    }
  };

  // Función para forzar la actualización de la página
  const setPageUpdated = () => {
    // Puedes usar window.location.reload() para recargar la página
    // Si estás utilizando React con rutas, puedes forzar una actualización del componente con un cambio en el estado
    window.location.reload(); // Recargar la página
  };

  return (
    <>
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalle del Pago</Text>
          {selectedOrder && (
            <View>
              <Text style={styles.bold}>ID:</Text> <Text>{selectedOrder.id}</Text>
              <Text style={styles.bold}>Estado:</Text> <Text>{selectedOrder.estado}</Text>
              <Text style={styles.bold}>Fecha:</Text> <Text>{selectedOrder.fechaRealizacion}</Text>
              <Text style={styles.bold}>Hora inicio:</Text> <Text>{selectedOrder.horaRealizacion}</Text>

              <Text style={[styles.modalTitle, { fontSize: 18, marginTop: 20 }]}>Productos</Text>
              {selectedOrder.producto.map((p, i) => (
                <View key={i} style={styles.productCard}>
                  <Image source={{ uri: p.imageUrl }} style={styles.productImage} />
                  <View style={styles.productDetails}>
                    <Text style={styles.bold}>Nombre:</Text> <Text>{p.nombre}</Text>
                    <Text style={styles.bold}>Precio:</Text> <Text>${p.precio}</Text>
                    <Text style={styles.bold}>Cantidad:</Text> <Text>{p.cantidad}</Text>
                  </View>
                </View>
              ))}
              <Text style={styles.bold}>Subtotal:</Text> <Text>${selectedOrder.precioTotal}</Text>
              <Text style={styles.bold}>Total: con impuestos %19</Text> <Text>${total}</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleOrderPaid} style={styles.pagoButton}>
            <Text style={{ color: 'green' }}>Orden Pagada</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={{ color: 'white' }}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Modal de recibo */}
      <ReciboProductoModal
        modalVisible={showReceiptModal}
        setModalVisible={setShowReceiptModal}
        selectedOrder={selectedOrder}
        setPageUpdated={setPageUpdated} // Pasamos la función para actualizar la página
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff8403',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  pagoButton: {
    marginTop: 20,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default PagoproductoModal;
