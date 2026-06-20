import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Functions
const functions = getFunctions(app);

// 👇 ADD THIS EXACT PIECE OF CODE HERE 👇
// It checks if you are running on localhost. If yes, it redirects to your local machine.
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  console.log("👉 Connecting frontend to local Firebase Emulators...");
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export { app, functions };

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)