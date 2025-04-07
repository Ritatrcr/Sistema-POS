// DetallesOrdenModal.tsx
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
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>; //funcion que actualiza el estado del modal
  selectedOrder: Order | null; // orden seleccionada o null si no hay ninguna
}
//componente funcional en react que recibe props y retorna un elemento visual, como en este caso el modal, FC functioncomponent
const DetallesOrdenModal: React.FC<DetallesOrdenModalProps> = ({ modalVisible, setModalVisible, selectedOrder }) => {
  return (
    <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
      <ScrollView style={styles.modalContent}>
        <Text style={styles.modalTitle}>Detalle del Pago</Text>
        {selectedOrder && ( //si hay una orden seleccionada, se muestra el detalle osea si no es null
          <View>
            <Text style={styles.bold}>ID:</Text> <Text>{selectedOrder.id}</Text>
            <Text style={styles.bold}>Estado:</Text> <Text>{selectedOrder.estado}</Text>
            <Text style={styles.bold}>Total:</Text> <Text>${selectedOrder.precioTotal}</Text>
            <Text style={styles.bold}>Fecha:</Text> <Text>{selectedOrder.fechaRealizacion}</Text>
            <Text style={styles.bold}>Hora inicio:</Text> <Text>{selectedOrder.horaRealizacion}</Text>
            <Text style={styles.bold}>Hora fin:</Text> <Text>{selectedOrder.horaFinalizacion || "-"}</Text>
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
          </View>
        )}
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
          <Text style={{ color: 'white' }}>Cerar</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({modalContent: {
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

export default DetallesOrdenModal;
