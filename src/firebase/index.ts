'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCpoD_CMCccniOaBrirPyPcMGsfrqgn65Y",
    authDomain: "studio-9295250327-e0fca.firebaseapp.com",
    projectId: "studio-9295250327-e0fca",
    storageBucket: "studio-9295250327-e0fca.appspot.com",
    messagingSenderId: "858476699204",
    appId: "1:858476699204:web:e32b77743aaa18e56f2611",
    measurementId: ""
};

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
};

let firebaseServices: FirebaseServices | null = null;

export function initializeFirebase(): FirebaseServices {
  if (firebaseServices) {
    return firebaseServices;
  }
  
  if (typeof window === 'undefined') {
    throw new Error("Firebase should only be initialized on the client side.");
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  firebaseServices = { app, auth, firestore, storage };
  return firebaseServices;
}

export {
  FirebaseClientProvider,
} from './client-provider';

export {
  useAuth,
  useFirestore,
  useFirebaseApp,
  useStorage,
} from './provider';

export { useUserProfile } from '../hooks/use-user-profile.tsx';
