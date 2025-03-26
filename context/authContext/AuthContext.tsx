// context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, signInAnonymously } from "firebase/auth";
import { auth } from "../../utils/FirebaseConfig";
import { db } from "../../utils/FirebaseConfig"; // Asegúrate de que tienes esta configuración en tu archivo FirebaseConfig.ts
import { doc, setDoc } from "firebase/firestore";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    try {
      // Registro del usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Guardar la información del usuario en Firestore
      console.log({
        firebaseUser
      })
      await setDoc(doc(db, "users", firebaseUser.uid), {
        email: email,
        uid: firebaseUser.uid,
        role: "user",  // Asume el rol "user" por defecto
      });
    } catch (error) {
      console.log(error);

    }
  };


  const logout = async () => {
    await signOut(auth);
  };



  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
