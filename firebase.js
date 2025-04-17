import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// 🔥 Configuración de Firebase (NO compartas estos datos públicamente)
const firebaseConfig = {
    apiKey: "AIzaSyDc5oTB6deWTf8---98uTfhsd0Y8kqqQaY",
    authDomain: "signin-c99e3.firebaseapp.com",
    projectId: "signin-c99e3",
    storageBucket: "signin-c99e3.firebasestorage.app",
    messagingSenderId: "113890848184",
    appId: "1:113890848184:web:e9799bb096aff108c5f34d"
  };


// ✅ Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 🔥 Conectar Firestore

// ✅ Proveedores de autenticación
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// ✅ Función de inicio de sesión con Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Usuario autenticado con Google:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error.message);
  }
};

// ✅ Función de inicio de sesión con Facebook
const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log("Usuario autenticado con Facebook:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Facebook:", error.message);
  }
};

// ✅ Cerrar sesión
const logout = async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada");
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
  }
};

// ✅ Exportar auth y Firestore para usarlos en otros archivos
export { auth, db, signInWithGoogle, signInWithFacebook, logout };
