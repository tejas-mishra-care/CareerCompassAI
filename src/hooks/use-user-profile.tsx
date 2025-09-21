
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
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { app, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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
            // This might happen on first-time social sign-in.
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
          console.error("Failed to get user profile from Firestore.", error);
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
      setUserProfileState(profile); 
      if (profile && user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
            await setDoc(userDocRef, profile, { merge: true });
        } catch (error) {
            console.error("Failed to save user profile to Firestore", error);
            throw error;
        }
      }
    },
    [user]
  );
  
  const isProfileComplete = useMemo(() => {
      if (!userProfile) return false;
      return !!userProfile.bio && userProfile.skills && userProfile.skills.length > 0;
  }, [userProfile]);

  // Navigation logic
   useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user) {
      // If there's no user, and they are not on a public path, redirect to login.
      if (!isPublicPath) {
        router.push('/login');
      }
    } else {
      // If there is a user...
      if (userProfile?.onboardingCompleted) {
        // ...and onboarding is complete, send them to the dashboard if they land on a public page.
        if (isPublicPath) {
          router.push('/dashboard');
        }
      } else {
        // ...and onboarding is NOT complete, force them to the profile page.
        if (pathname !== '/profile') {
          router.push('/profile');
        }
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

