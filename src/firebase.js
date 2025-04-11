import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import * as dummyAuth from "./utils/dummyAuth";

// Check if we should use dummy auth - consistent with authService.js
const isDevelopment = process.env.NODE_ENV === "development";
const localStorageSetting = localStorage.getItem("useDummyAuth");
const useDummyAuth = 
  localStorageSetting === "true" || 
  (localStorageSetting !== "false" && isDevelopment);

// Your web app's Firebase configuration
// For the hackathon, you would replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD3dkgGMS5Je4Z5kavYl03VzKFnTrA_6YE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "finupi-8fb02.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "finupi-8fb02",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "finupi-8fb02.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "455479413495",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:455479413495:web:80f99a19b8dfd02aca4a48",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Always initialize the real Firebase Auth
// (We still provide dummy auth via the service layer)
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Export
export { app, auth, db, useDummyAuth };
