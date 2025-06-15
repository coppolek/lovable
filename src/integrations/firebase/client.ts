
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhI3fsnR4_upwveKW5tEoKF72L9kxPuMI",
  authDomain: "gen-lang-client-0735264419.firebaseapp.com",
  projectId: "gen-lang-client-0735264419",
  storageBucket: "gen-lang-client-0735264419.firebasestorage.app",
  messagingSenderId: "1051534524323",
  appId: "1:1051534524323:web:2f13a95f9c9ceaa1b52416",
  measurementId: "G-C56X642VPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
