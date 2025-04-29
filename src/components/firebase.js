// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyAalMEuhw9ZXIdAEVQShMssgDRwRnw2ba8",
  authDomain: "cable-payment-managment.firebaseapp.com",
  projectId: "cable-payment-managment",
  storageBucket: "cable-payment-managment.firebasestorage.app",
  messagingSenderId: "892684682200",
  appId: "1:892684682200:web:4497b99b490f6471a968ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
export {db,auth}