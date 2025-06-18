// Importa los módulos de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHnihjo2df71IsWSiW-t44Djuxh4l_tRY",
  authDomain: "pintura2-36966.firebaseapp.com",
  projectId: "pintura2-36966",
  storageBucket: "pintura2-36966.firebasestorage.app",
  messagingSenderId: "496399802898",
  appId: "1:496399802898:web:198868bd05ad6570e5eecb"
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