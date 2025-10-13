// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCpoD_CMCccniOaBrirPyPcMGsfrqgn65Y",
  authDomain: "studio-9295250327-e0fca.firebaseapp.com",
  projectId: "studio-9295250327-e0fca",
  storageBucket: "studio-9295250327-e0fca.appspot.com",
  messagingSenderId: "858476699204",
  appId: "1:858476699204:web:e32b77743aaa18e56f2611",
  measurementId: ""
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});


export { app, db };
