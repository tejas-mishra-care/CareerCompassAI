
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
import { FirebaseErrorListener } from '@/components/layout/FirebaseErrorListener';
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
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
      setAuthLoading(true);
      return;
    };
    const unsubscribeFromAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (!firebaseUser) {
        setUserProfileState(null);
        setProfileLoading(false); // No user, so no profile to load
      }
    });

    return () => unsubscribeFromAuth();
  }, [auth]);

  useEffect(() => {
    if (!user || !db) {
        setProfileLoading(false);
        return;
    };

    setProfileLoading(true);
    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribeFromProfile = onSnapshot(userDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfileState({uid: docSnap.id, ...docSnap.data()} as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName || 'New User',
            bio: '',
            skills: [],
            activePathways: [],
            onboardingCompleted: false,
          };
          setUserProfileState(newProfile);
        }
        setProfileLoading(false);
      }, 
      async (error) => {
        console.error("Firestore onSnapshot error:", error);
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'get'
        });
        errorEmitter.emit('permission-error', permissionError);

        setUserProfileState(null);
        setProfileLoading(false);
      }
    );
    return () => unsubscribeFromProfile();
  }, [user, db]);

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

        setDoc(userDocRef, dataToSet, { merge: true })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'update',
                    requestResourceData: dataToSet,
                });
                errorEmitter.emit('permission-error', permissionError);
                console.error("Failed to save user profile to Firestore", serverError);
            });
      }
    },
    [user, db]
  );
  
  const loading = authLoading || profileLoading;

  const isProfileComplete = useMemo(() => {
      if (!userProfile) return false;
      return !!userProfile.bio && userProfile.skills && userProfile.skills.length > 0;
  }, [userProfile]);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user) {
      if (pathname === '/login') {
        router.push('/dashboard');
      } else if (!userProfile?.onboardingCompleted && pathname !== '/profile') {
        router.push('/profile');
      }
    }
  }, [user, userProfile, loading, pathname, router]);

  const value = { user, userProfile, setUserProfile, isProfileComplete, loading };

  return (
    <UserProfileContext.Provider value={value}>
      <FirebaseErrorListener />
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
