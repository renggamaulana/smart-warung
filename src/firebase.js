// Ganti dengan konfigurasi Firebase kamu
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBc3_FPvJbR949WiJ_w3-I1nN-M8Cu6jlY",
  authDomain: "smart-warung-14624.firebaseapp.com",
  projectId: "smart-warung-14624",
  storageBucket: "smart-warung-14624.firebasestorage.app",
  messagingSenderId: "536039123104",
  appId: "1:536039123104:web:63834bffda7764734541c5",
  measurementId: "G-5RZ2CQYNKF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
