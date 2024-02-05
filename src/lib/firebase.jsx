// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    doc,
    onSnapshot,
    addDoc,
    collection,
    query,
    updateDoc,
    deleteDoc,
    getFirestore,
  } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlvjrgkEvG-ELeZuZNO0ugkBRovoVERRw",
  authDomain: "diplomado-rd.firebaseapp.com",
  projectId: "diplomado-rd",
  storageBucket: "diplomado-rd.appspot.com",
  messagingSenderId: "447276129810",
  appId: "1:447276129810:web:a032bcb74897a7911042cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const db = getFirestore(app);

// Exporting everything that we need from firebase
export { doc, onSnapshot, addDoc, collection, query, updateDoc, deleteDoc };