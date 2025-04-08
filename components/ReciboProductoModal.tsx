import React from 'react';
import { Modal, ScrollView, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';

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
  setPageUpdated: () => void; // Propiedad para actualizar la página
}

const ReciboProductoModal: React.FC<DetallesOrdenModalProps> = ({ modalVisible, setModalVisible, selectedOrder, setPageUpdated }) => {
  const precio = selectedOrder?.precioTotal || 0;
  const impuesto = precio * 0.19;
  const total = precio + impuesto;

  // Función para manejar el cierre del modal y actualización de la página
  const handleClose = () => {
    setModalVisible(false); // Cierra el modal de recibo
    setPageUpdated(); // Actualiza la página
  };

  return (
    <Modal visible={modalVisible} animationType="slide" onRequestClose={handleClose}>
      <ScrollView style={styles.modalContent}>
        <Text style={styles.modalTitle}>Recibo de Compra</Text>
        {selectedOrder && (
          <View>
            <Text style={styles.bold}>ID de Orden:</Text> <Text>{selectedOrder.id}</Text>
            <Text style={styles.bold}>Fecha de Compra:</Text> <Text>{selectedOrder.fechaRealizacion}</Text>
            <Text style={styles.bold}>Hora de Compra:</Text> <Text>{selectedOrder.horaRealizacion}</Text>

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
            <Text style={styles.bold}>Impuesto (19%):</Text> <Text>${impuesto}</Text>
            <Text style={styles.bold}>Total:</Text> <Text>${total}</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={{ color: 'white' }}>Cerrar Recibo</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
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
});

export default ReciboProductoModal;
