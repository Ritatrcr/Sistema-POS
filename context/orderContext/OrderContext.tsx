import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../../utils/FirebaseConfig";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, DocumentData, onSnapshot } from "firebase/firestore";

// Tipo de orden
interface Order {
  id?: string;
  producto: { idProducto: string; cantidad: number }[];
  precioTotal: number;
  estado: "ordenado" | "cocinando" | "Listo para recoger" | "entregado" | "listo para pago" | "finalizado" | "cancelado";
  userId: string;
  fechaRealizacion: string;
  horaRealizacion: string;
  horaFinalizacion?: string;
}


// Crear el contexto
const OrderContext = createContext<any>(null);

const getHoraFechaActual = () => {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString("es-CO"); // ej: "6/4/2025"
  const hora = ahora.toLocaleTimeString("es-CO");  // ej: "3:42:10 p. m."
  return { fecha, hora };
};


// Proveedor
export const OrderProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = async (orderData: Omit<Order, "id" | "fechaRealizacion" | "horaRealizacion">) => {
    try {
      const orderRef = doc(collection(db, "ordenes"));
      const { fecha, hora } = getHoraFechaActual();
      const ordenConFecha = {
        ...orderData,
        fechaRealizacion: fecha,
        horaRealizacion: hora,
      };
  
      await setDoc(orderRef, ordenConFecha);
      console.log("Orden creada exitosamente");
    } catch (error) {
      console.error("Error al crear la orden: ", error);
    }
  };
  

  // Obtener todas las órdenes
  const fetchAllOrders = () => {
    const ordersCollection = collection(db, "ordenes");
  
    onSnapshot(ordersCollection, (querySnapshot) => {
      const ordersList: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersList); // Actualiza el estado con las órdenes en tiempo real
    });
  };

  const setHoraFinalizacion = async (orderId: string) => {
    try {
      const horaFinal = new Date().toLocaleTimeString("es-CO");
      const orderRef = doc(db, "ordenes", orderId);
      await updateDoc(orderRef, { horaFinalizacion: horaFinal });
      console.log("Hora de finalización actualizada");
    } catch (error) {
      console.error("Error al actualizar hora de finalización:", error);
    }
  };
  

  // Actualizar estado de una orden
  const updateOrderStatus = async (orderId: string, nuevoEstado: "ordenado" | "cocinando" | "Listo para recoger" | "entregado" | "listo para pago" | "finalizado" | "cancelado") => {
    try {
      const orderRef = doc(db, "ordenes", orderId);
      await updateDoc(orderRef, { estado: nuevoEstado });
      console.log("Estado de la orden actualizado");
    } catch (error) {
      console.error("Error al actualizar el estado de la orden: ", error);
    }
  };

  // Cargar las órdenes al iniciar
  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        fetchAllOrders,
        updateOrderStatus,
        setHoraFinalizacion, 
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
// Hook para usarlo fácilmente
export const useOrder = () => useContext(OrderContext);
