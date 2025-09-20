
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, clearIndexedDbPersistence, initializeFirestore } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { app } from '@/lib/firebase';

interface UserProfileContextType {
  user: User | null;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  isProfileComplete: boolean;
  loading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export const UserProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  
  useEffect(() => {
    const initialize = async () => {
        setLoading(true);
        const db = getFirestore(app);

        try {
            // This is a one-time operation to clear a potentially corrupt cache.
            await clearIndexedDbPersistence(db);
            console.log("Successfully cleared Firestore IndexedDB persistence.");
        } catch (error) {
            console.warn("Could not clear Firestore IndexedDB persistence. This is expected if it was never enabled or already cleared.", error);
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        setUserProfileState(docSnap.data() as UserProfile);
                    } else {
                        const newProfile: UserProfile = {
                            name: firebaseUser.displayName || 'New User',
                            bio: '',
                            skills: [],
                            activePathways: [],
                        };
                        await setDoc(userDocRef, newProfile);
                        setUserProfileState(newProfile);
                    }
                } catch (error) {
                    console.error("Failed to get user profile from Firestore. This might be due to API key restrictions or network issues.", error);
                    setUserProfileState(null); // Clear profile on error
                } finally {
                     setLoading(false);
                }
            } else {
                // User is signed out
                setUser(null);
                setUserProfileState(null);
                setLoading(false);
            }
        });
        return unsubscribe;
    };

    const unsubscribePromise = initialize();

    return () => {
        unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
}, [auth]);


  const setUserProfile = useCallback(
    async (profile: UserProfile | null) => {
      setUserProfileState(profile);
      if (profile && user) {
        const db = getFirestore(app);
        const userDocRef = doc(db, 'users', user.uid);
        try {
            // Use setDoc with merge to create or update the document
            await setDoc(userDocRef, profile, { merge: true });
        } catch (error) {
            console.error("Failed to save user profile to Firestore", error);
        }
      }
    },
    [user]
  );

  const isProfileComplete = useMemo(
    () =>
      !!userProfile?.name &&
      userProfile.skills &&
      userProfile.skills.length > 0,
    [userProfile]
  );

  const value = { user, userProfile, setUserProfile, isProfileComplete, loading };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error(
      'useUserProfile must be used within a UserProfileProvider'
    );
  }
  return context;
};

    