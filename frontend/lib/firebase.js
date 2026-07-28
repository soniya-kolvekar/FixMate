import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyMockKeyForFixMateDemo12345",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "fixmate-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fixmate-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "fixmate-app.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "109823471928",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:109823471928:web:abcdef123456"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication Helpers with Mock Fallback for Local Demo
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    // Fallback for Demo Mode
    if (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return {
        success: true,
        user: { email, uid: `mock-uid-${Date.now()}`, displayName: email.split('@')[0] },
        isMock: true
      };
    }
    throw error;
  }
};

export const registerUser = async (email, password, role = 'Customer') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user, role };
  } catch (error) {
    // Fallback for Demo Mode
    if (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return {
        success: true,
        user: { email, uid: `mock-uid-${Date.now()}`, displayName: email.split('@')[0] },
        role,
        isMock: true
      };
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err) {
    return { success: true };
  }
};

export { app, auth, db };
