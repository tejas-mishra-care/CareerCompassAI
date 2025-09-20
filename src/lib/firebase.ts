
// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  projectId: "studio-9295250327-e0fca",
  appId: "1:858476699204:web:e32b77743aaa18e56f2611",
  apiKey: "AIzaSyCpoD_CMCccniOaBrirPyPcMGsfrqgn65Y",
  authDomain: "studio-9295250327-e0fca.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "858476699204"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig, {
    // This can help with some auth issues on localhost
    authDomain: "studio-9295250327-e0fca.firebaseapp.com",
}) : getApp();

export { app };
