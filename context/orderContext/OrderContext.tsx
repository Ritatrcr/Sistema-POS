import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../../utils/FirebaseConfig";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, DocumentData } from "firebase/firestore";

// Tipo de orden
interface Order {
  id?: string;
  producto: { idProducto: string; cantidad: number }[];
  precioTotal: number;
  estado: "ordenado" | "entregado"| "preparando";
  userId: string;
}

// Crear el contexto
const OrderContext = createContext<any>(null);

// Proveedor
export const OrderProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Crear una nueva orden
  const createOrder = async (orderData: Omit<Order, "id">) => {
    try {
      const orderRef = doc(collection(db, "ordenes"));
      await setDoc(orderRef, orderData);
      console.log("Orden creada exitosamente");
    } catch (error) {
      console.error("Error al crear la orden: ", error);
    }
  };

  // Obtener todas las órdenes
  const fetchAllOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ordenes"));
      const ordersList: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersList);
    } catch (error) {
      console.error("Error al obtener órdenes: ", error);
    }
  };

  // Actualizar estado de una orden
  const updateOrderStatus = async (orderId: string, nuevoEstado: "ordenado" | "entregado") => {
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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Hook para usarlo fácilmente
export const useOrder = () => useContext(OrderContext);
