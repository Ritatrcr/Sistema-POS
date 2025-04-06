
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAfTXlmYHaN_4moTJNyRGeeEjd6XlhRZhc",
  authDomain: "sistema-pos-69026.firebaseapp.com",
  projectId: "sistema-pos-69026",
  storageBucket: "sistema-pos-69026.firebasestorage.app",
  messagingSenderId: "706222144600",
  appId: "1:706222144600:web:2651c56b3af0c29b5e9e2d",
  measurementId: "G-8LQMSF0774"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 

export const db = getFirestore(app);
export const auth = getAuth(app);
