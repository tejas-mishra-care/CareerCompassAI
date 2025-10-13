
// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

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

const db = getFirestore(app);

// Enable offline persistence only in the browser
if (typeof window !== 'undefined') {
    try {
        enableIndexedDbPersistence(db)
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled in one tab at a time.
            } else if (err.code === 'unimplemented') {
                // The current browser does not support all of the features required to enable persistence.
            }
        });
    } catch (err) {
        console.error("Error enabling Firestore persistence:", err);
    }
}


export { app, db };
