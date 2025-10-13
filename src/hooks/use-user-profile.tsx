
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { useAuth, useFirestore } from '@/firebase';

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
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
        setLoading(true);
        return;
    };
    
    const unsubscribeFromAuth = onAuthStateChanged(auth, (firebaseUser) => {
        setLoading(true); // Set loading to true whenever auth state changes
        if (firebaseUser) {
            setUser(firebaseUser);
        } else {
            setUser(null);
            setUserProfileState(null);
            setLoading(false);
        }
    });

    return () => unsubscribeFromAuth();
  }, [auth]);

  useEffect(() => {
    if (!user || !db) {
        if (!auth?.currentUser) { // If there's no user at all
            setLoading(false);
        }
        return;
    };

    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribeFromProfile = onSnapshot(userDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfileState({uid: docSnap.id, ...docSnap.data()} as UserProfile);
        } else {
          // Profile doesn't exist, create a shell. Onboarding will fill it.
          const newProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName || 'New User',
            bio: '',
            skills: [],
            activePathways: [],
            onboardingCompleted: false,
          };
          // We don't set it here, let the logic below handle it
          setUserProfileState(newProfile);
        }
        setLoading(false);
      }, 
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'get'
        });
        errorEmitter.emit('permission-error', permissionError);

        setUserProfileState(null);
        setLoading(false);
      }
    );
    return () => unsubscribeFromProfile();
  }, [user, db, auth]);

  const setUserProfile = useCallback(
    async (profileData: UserProfile | null) => {
      if (!user || !db) return; 

      setUserProfileState(profileData); 
      
      if (profileData) {
        const userDocRef = doc(db, 'users', user.uid);
        const dataToSet = {
            ...profileData,
            updatedAt: serverTimestamp(),
            activePathways: profileData.activePathways || [],
        };

        const { uid, ...restOfData } = dataToSet;

        setDoc(userDocRef, restOfData, { merge: true })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'update',
                    requestResourceData: restOfData,
                });
                errorEmitter.emit('permission-error', permissionError);
                console.error("Failed to save user profile to Firestore", serverError);
            });
      }
    },
    [user, db]
  );
  
  const isProfileComplete = useMemo(() => {
      if (!userProfile) return false;
      return !!userProfile.bio && userProfile.skills && userProfile.skills.length > 0;
  }, [userProfile]);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    if (user) {
      // User is logged in
      if (isPublicPath) {
        router.push('/dashboard');
      } else if (!userProfile?.onboardingCompleted && pathname !== '/profile') {
        // User has not completed onboarding and is not on the profile page
        router.push('/profile');
      }
    } else {
      // No user is logged in
      if (!isPublicPath) {
        router.push('/login');
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
