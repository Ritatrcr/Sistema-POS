// ReciboContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../../utils/FirebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

interface Recibo {
  id?: string;
  orderId: string;
  fechaCompra: string;
  horaCompra: string;
  total: number;
  productos: { nombre: string; precio: number; cantidad: number }[];
}

const ReciboContext = createContext<any>(null);

const getHoraFechaActual = () => {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-CO');
  const hora = ahora.toLocaleTimeString('es-CO');
  return { fecha, hora };
};

export const ReciboProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [recibos, setRecibos] = useState<Recibo[]>([]);

  // Crear un nuevo recibo
  const createRecibo = async (orderId: string, productos: { nombre: string; precio: number; cantidad: number }[], total: number) => {
    try {
      const { fecha, hora } = getHoraFechaActual();
      const reciboRef = doc(collection(db, 'recibos'));
      const nuevoRecibo = {
        orderId,
        productos,
        total,
        fechaCompra: fecha,
        horaCompra: hora,
      };

      await setDoc(reciboRef, nuevoRecibo);
      console.log('Recibo creado exitosamente');
    } catch (error) {
      console.error('Error al crear el recibo: ', error);
    }
  };

  return (
    <ReciboContext.Provider value={{ recibos, createRecibo }}>
      {children}
    </ReciboContext.Provider>
  );
};

export const useRecibo = () => useContext(ReciboContext);
