import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import * as dummyAuth from "./utils/dummyAuth";

// Check if we should use dummy auth
const isDevelopment = process.env.NODE_ENV === "development";
const forceDummyAuth = true; // Set to false in production
const useDummyAuth = isDevelopment || forceDummyAuth;

// Your web app's Firebase configuration
// For the hackathon, you would replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase (even in dummy mode, we'll still use Firestore)
const app = initializeApp(firebaseConfig);

// Setup auth - either real Firebase Auth or our dummy auth
const auth = useDummyAuth ? dummyAuth : getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Export either real or dummy auth methods
export { auth, db, useDummyAuth };
