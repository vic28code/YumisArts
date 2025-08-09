import { initializeApp } from 'firebase/app';
import {
  getDatabase, ref, push, serverTimestamp,
  onChildAdded, query, orderByChild, limitToLast
} from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // <- RTDB URL
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

// Crear encargo
export async function crearEncargo({ nombre, correo, celular, tipoCuadro }) {
  await push(ref(rtdb, 'encargos'), {
    nombre,
    correo,
    celular,
    tipoCuadro,
    fecha: serverTimestamp()   // millis desde el servidor
  });
}

// Suscribirse en tiempo real (agregados) a los últimos 20
export function suscribirseUltimosEncargos(callback) {
  const q = query(ref(rtdb, 'encargos'), orderByChild('fecha'), limitToLast(20));
  return onChildAdded(q, (snap) => {
    const d = snap.val();
    callback({
      id: snap.key,
      nombre: d?.nombre ?? '',
      correo: d?.correo ?? '',
      celular: d?.celular ?? '',
      tipoCuadro: d?.tipoCuadro ?? '',
      fecha: typeof d?.fecha === 'number' ? new Date(d.fecha) : null
    });
  }, (err) => console.error('RTDB onChildAdded error:', err));
}
