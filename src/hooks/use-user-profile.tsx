
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
import { getFirestore, doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { app, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { FirebaseErrorListener } from '@/components/layout/FirebaseErrorListener';

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
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const auth = getAuth(app);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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
    if (!user) {
        setProfileLoading(false);
        return;
    };

    setProfileLoading(true);
    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribeFromProfile = onSnapshot(userDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfileState(docSnap.data() as UserProfile);
        } else {
          // The document doesn't exist, which might be expected for a new user.
          // We create a local, temporary profile. The first write operation (e.g., finishing onboarding) will create the doc.
          const newProfile: UserProfile = {
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
  }, [user]);

  const setUserProfile = useCallback(
    async (profileData: UserProfile | null) => {
      if (!user) return; // No authenticated user, do nothing.

      // We always want to keep the local state in sync
      setUserProfileState(profileData); 
      
      if (profileData) {
        const userDocRef = doc(db, 'users', user.uid);
        const dataToSet = {
            ...profileData,
            updatedAt: serverTimestamp(), // Add a timestamp for tracking updates
            // Ensure we don't write undefined values to Firestore
            activePathways: profileData.activePathways || [],
        };

        setDoc(userDocRef, dataToSet, { merge: true })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'update', // or 'create' depending on logic
                    requestResourceData: dataToSet,
                });
                errorEmitter.emit('permission-error', permissionError);
                console.error("Failed to save user profile to Firestore", serverError);
                // Optionally re-throw or handle the UI feedback here
            });
      }
    },
    [user]
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
      // User is logged in
      if (pathname === '/login') {
        // If user is on login page, redirect them away.
        router.push('/dashboard');
      } else if (!userProfile?.onboardingCompleted && pathname !== '/profile') {
        // If onboarding isn't done and they aren't on the profile page, send them there.
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
