
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
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { app, db } from '@/lib/firebase';

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false); // Stop loading once user is confirmed

        // Fetch profile data in the background
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserProfileState(docSnap.data() as UserProfile);
          } else {
            // If no profile exists, create a basic one in Firestore.
            const newProfile: UserProfile = {
                name: firebaseUser.displayName || 'New User',
                bio: '',
                skills: [],
                activePathways: [],
            }
            try {
              await setDoc(userDocRef, newProfile);
              setUserProfileState(newProfile);
            } catch (e) {
               console.error("Failed to get or create user profile in Firestore", e);
            }
          }
        } catch (error) {
          console.error('Failed to get user profile from Firestore', error);
          setUserProfileState(null); // Clear profile on error
        }
      } else {
        // User is signed out
        setUser(null);
        setUserProfileState(null);
        setLoading(false); // Stop loading
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const setUserProfile = useCallback(
    async (profile: UserProfile | null) => {
      setUserProfileState(profile);
      if (profile && user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
            // Use setDoc with merge to create or update the document
            await setDoc(userDocRef, profile, { merge: true });
        } catch (error) {
            console.error("Failed to save user profile to Firestore", error);
        }
      }
    },
    [user, db]
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
