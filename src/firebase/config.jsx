// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";    
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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