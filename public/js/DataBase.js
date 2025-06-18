// Importa los módulos de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

// Configuración de tu proyecto Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para agregar una pintura entregada
export async function agregarPinturaEntregada(nombre) {
  await addDoc(collection(db, "pinturasEntregadas"), {
    nombre: nombre,
    fecha: new Date()
  });
}

// Función para obtener las últimas 5 pinturas entregadas
export async function obtenerPinturasEntregadas() {
  const q = query(
    collection(db, "pinturasEntregadas"),
    orderBy("fecha", "desc"),
    limit(5)
  );
  const querySnapshot = await getDocs(q);
  const lista = [];
  querySnapshot.forEach((doc) => {
    lista.push(doc.data().nombre);
  });
  return lista;
}