// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

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


// Enable offline persistence
const db = getFirestore(app);
try {
    enableIndexedDbPersistence(db);
} catch (err: any) {
    if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence failed: Browser does not support it');
    }
}


export { app };
