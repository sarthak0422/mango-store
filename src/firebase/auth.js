import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { auth } from "./config";
import { createUserProfile, getUserProfile } from "../services/firestoreService";

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

/**
 * GOOGLE SIGN IN
 * Signs in via popup and creates user profile metadata inside Firestore if it doesn't exist
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document already exists in Firestore database
    let profile = await getUserProfile(user.uid);
    
    if (!profile) {
      profile = {
        email: user.email,
        isAdmin: user.email === "w@gmail.com", // Keeping your admin logic sync standard
        createdAt: Date.now(),
        displayName: user.displayName || "",
        photoURL: user.photoURL || ""
      };
      await createUserProfile(user.uid, profile);
    }
    
    return { user, profile };
  } catch (error) {
    throw error;
  }
};

/**
 * REGISTER
 */
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createUserProfile(user.uid, {
      email: user.email,
      isAdmin: user.email === "w@gmail.com", // Dynamic assignment matching the criteria
      createdAt: Date.now(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * LOGIN
 */
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * LOGOUT
 */
export const logoutUser = async () => {
  return await signOut(auth);
};

/**
 * AUTH STATE LISTENER
 */
export const subscribeToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};