
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { app as firebaseApp, db as firestoreDb } from '../lib/firebase'; 
import { getStorage, type FirebaseStorage } from 'firebase/storage';

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

  const app = !getApps().length ? firebaseApp : getApp();
  const auth = getAuth(app);
  const firestore = firestoreDb;
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

export { useUserProfile } from '../hooks/use-user-profile';
