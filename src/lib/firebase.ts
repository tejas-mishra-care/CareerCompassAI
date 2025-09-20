
// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-9295250327-e0fca",
  appId: "1:858476699204:web:e32b77743aaa18e56f2611",
  apiKey: "AIzaSyCpoD_CMCccniOaBrirPyPcMGsfrqgn65Y",
  authDomain: "studio-9295250327-e0fca.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "858476699204"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with memory cache as a fallback.
// The actual persistence is handled in the useUserProfile hook to manage cleanup.
const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});


export { app, db };
