import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";       // Add this for login
import { getFirestore } from "firebase/firestore"; // Add this for database
import { getStorage } from "firebase/storage";   // Add this for file uploads

const firebaseConfig = {
  apiKey: "AIzaSyAzvi2IeTrrmDBauGYX_O7xIa4eXw-HlOA",
  authDomain: "banoqabil-dashboard.firebaseapp.com",
  projectId: "banoqabil-dashboard",
  storageBucket: "banoqabil-dashboard.firebasestorage.app",
  messagingSenderId: "305771150485",
  appId: "1:305771150485:web:4b133e47ac709a7fbcaf9c",
  measurementId: "G-CVTYY63BPJ",
};

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Export the specific services you need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;