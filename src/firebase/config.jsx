import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";    
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzvi2IeTrrmDBauGYX_O7xIa4eXw-HlOA",
  authDomain: "banoqabil-dashboard.firebaseapp.com",
  projectId: "banoqabil-dashboard",
  storageBucket: "banoqabil-dashboard.firebasestorage.app",
  messagingSenderId: "305771150485",
  appId: "1:305771150485:web:4b133e47ac709a7fbcaf9c",
  measurementId: "G-CVTYY63BPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);