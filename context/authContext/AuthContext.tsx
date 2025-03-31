// context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "../../utils/FirebaseConfig";
import { db } from "../../utils/FirebaseConfig"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextProps {
  user: User | null;
  userName: string | null;
  userEmail: string | null;  // Almacenar el correo del usuario
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // Almacenar el nombre del usuario
  const [userEmail, setUserEmail] = useState<string | null>(null); // Almacenar el correo del usuario

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Obtener el nombre y correo del usuario desde Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data()?.name || null);
          setUserEmail(currentUser.email || null); // Obtener el correo del usuario directamente desde Firebase Auth
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: name,  // Guardar el nombre del usuario
        email: email,
        uid: firebaseUser.uid,
        role: "user",  // Asume el rol "user" por defecto
      });
      setUserName(name); // Establecer el nombre después del registro
      setUserEmail(email); // Establecer el correo después del registro
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userName, userEmail, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
