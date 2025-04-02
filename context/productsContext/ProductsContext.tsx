import React, { createContext, useState, useContext, useEffect } from "react";
import { db, storage } from "../../utils/FirebaseConfig"; 
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, DocumentData } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Platform } from "react-native";

// Define los tipos para el producto
interface Product {
  nombre: string;
  ingredientes: string;
  tiempoPreparacion: string;
  calificaciones: number[];
  categoria: string;
  descripcion: string;
  pasos: string[];
  imageUrl?: string; // Agregar propiedad para la URL de la imagen
}

// Crear el contexto
const ProductContext = createContext<any>(null);

const uploadImage = async (image: File | string, productId: string): Promise<string> => {
  try {
    let blob;

    if (Platform.OS === "web") {
      if (!(image instanceof File)) throw new Error("La imagen no es un File válido");
      blob = image;
    } else {
      if (typeof image !== "string") throw new Error("En móvil, la imagen debe ser una URI string.");
      const response = await fetch(image);
      blob = await response.blob();
    }

    const storageRef = ref(storage, `productos/${productId}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir la imagen: ", error);
    throw new Error("Error al subir la imagen");
  }
};


// Proveedor del contexto
export const ProductProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Crear un nuevo producto
  const createProduct = async (productData: Product, imageUri: string) => {
    try {
      const productRef = doc(collection(db, "productos"));
      const imageUrl = await uploadImage(imageUri, productRef.id); // Subir la imagen y obtener la URL
      const newProduct = { ...productData, imageUrl }; // Agregar la URL de la imagen al producto
      await setDoc(productRef, newProduct); // Guardar el producto con la URL de la imagen
      console.log("Producto creado exitosamente");
    } catch (error) {
      console.error("Error al crear el producto: ", error);
    }
  };

  // Traer todos los productos
  const fetchAllProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const productsList: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() } as unknown as Product);
      });
      setProducts(productsList);
    } catch (error) {
      console.error("Error al obtener productos: ", error);
    }
  };

  // Traer un producto específico
  const fetchProductById = async (id: string) => {
    try {
      const docRef = doc(db, "productos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as unknown as Product;
      } else {
        console.log("No se encontró el producto");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el producto: ", error);
    }
  };

  // Editar un producto completo
  const updateProduct = async (id: string, updatedProduct: Product, imageUri?: string) => {
    try {
      if (imageUri) {
        const imageUrl = await uploadImage(imageUri, id); // Subir nueva imagen y obtener URL
        updatedProduct = { ...updatedProduct, imageUrl }; // Agregar la URL de la imagen al producto
      }
      const docRef = doc(db, "productos", id);
      await updateDoc(docRef, { ...updatedProduct });
      console.log("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el producto: ", error);
    }
  };

  // Editar la calificación de un producto
  const updateRating = async (id: string, newRating: number) => {
    try {
      const docRef = doc(db, "productos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const product = docSnap.data() as Product;
        const updatedRatings = [...product.calificaciones, newRating];
        await updateDoc(docRef, { calificaciones: updatedRatings });
        console.log("Calificación actualizada exitosamente");
      }
    } catch (error) {
      console.error("Error al actualizar la calificación: ", error);
    }
  };

  // Eliminar un producto
  const deleteProduct = async (id: string) => {
    try {
      const docRef = doc(db, "productos", id);
      await deleteDoc(docRef);
      console.log("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el producto: ", error);
    }
  };

  // Cargar los productos al iniciar
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        createProduct,
        fetchAllProducts,
        fetchProductById,
        updateProduct,
        updateRating,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Hook para usar el contexto
export const useProduct = () => {
  return useContext(ProductContext);
};
