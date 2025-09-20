
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
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
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
                onboardingCompleted: false,
            }
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

    return () => unsubscribe();
  }, [auth]);

  const setUserProfile = useCallback(
    async (profile: UserProfile | null) => {
      setUserProfileState(profile);
      if (profile && user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
            await setDoc(userDocRef, profile, { merge: true });
        } catch (error) {
            console.error("Failed to save user profile to Firestore", error);
        }
      }
    },
    [user]
  );
  
  const isProfileComplete = useMemo(() => {
      if (!userProfile) return false;
      return userProfile.onboardingCompleted === true && userProfile.skills && userProfile.skills.length > 0;
  }, [userProfile]);

  // Navigation logic
   useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user) {
      if (pathname === '/login') {
         router.push('/dashboard');
      }
      else if (!userProfile?.onboardingCompleted && pathname !== '/profile') {
        router.push('/profile');
      }
    }
  }, [user, userProfile, loading, pathname, router]);


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
