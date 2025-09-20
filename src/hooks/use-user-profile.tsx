
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
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { app, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface UserProfileContextType {
  user: User | null;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => Promise<void>;
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
    const unsubscribeFromAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setLoading(false);
        setUserProfileState(null);
      }
    });
    return () => unsubscribeFromAuth();
  }, [auth]);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeFromProfile = onSnapshot(userDocRef, 
        (docSnap) => {
          if (docSnap.exists()) {
            setUserProfileState(docSnap.data() as UserProfile);
          } else {
            // This case might happen on first-time social sign-in if the doc creation is delayed.
            const newProfile: UserProfile = {
                name: user.displayName || 'New User',
                bio: '',
                skills: [],
                activePathways: [],
                onboardingCompleted: false,
            };
            setDoc(userDocRef, newProfile).then(() => setUserProfileState(newProfile));
          }
          setLoading(false);
        }, 
        (error) => {
          console.error("Failed to get user profile from Firestore. This might be due to API key restrictions or network issues.", error);
          setUserProfileState(null);
          setLoading(false);
        }
      );
      return () => unsubscribeFromProfile();
    } else {
      // No user, not loading.
      setLoading(false);
    }
  }, [user]);


  const setUserProfile = useCallback(
    async (profile: UserProfile | null) => {
      // We keep the local state update for immediate UI feedback, 
      // but the onSnapshot listener will soon overwrite it with the canonical DB state.
      setUserProfileState(profile); 
      if (profile && user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
            await setDoc(userDocRef, profile, { merge: true });
        } catch (error) {
            console.error("Failed to save user profile to Firestore", error);
            // Re-throw to be caught by the calling function's try/catch
            throw error;
        }
      }
    },
    [user]
  );
  
  const isProfileComplete = useMemo(() => {
      if (!userProfile) return false;
      // Profile is complete if it has a bio and at least one skill.
      return !!userProfile.bio && userProfile.skills && userProfile.skills.length > 0;
  }, [userProfile]);

  // Navigation logic
   useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user) {
      if (isPublicPath) {
         router.push('/dashboard');
      }
      else if (!userProfile?.onboardingCompleted && pathname !== '/profile') {
        // If onboarding isn't done, force user to the profile page to start it.
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
