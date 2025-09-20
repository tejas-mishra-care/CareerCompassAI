
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);
      if (firebaseUser) {
        // In a real app, you would fetch the user's profile from Firestore
        // For now, we'll continue using localStorage as a mock database
        try {
          const storedProfile = localStorage.getItem(`userProfile_${firebaseUser.uid}`);
          if (storedProfile) {
            setUserProfileState(JSON.parse(storedProfile));
          } else {
            // If no profile exists, create a basic one.
            const newProfile: UserProfile = {
                name: firebaseUser.displayName || 'New User',
                bio: '',
                skills: [],
                activePathways: [],
            }
            setUserProfileState(newProfile);
            localStorage.setItem(`userProfile_${firebaseUser.uid}`, JSON.stringify(newProfile));
          }
        } catch (error) {
          console.error('Failed to parse user profile from localStorage', error);
          setUserProfileState(null);
        }
      } else {
        // User is signed out
        setUserProfileState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const setUserProfile = useCallback(
    (profile: UserProfile | null) => {
      setUserProfileState(profile);
      if (profile && user) {
        localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profile));
      } else if (user) {
        localStorage.removeItem(`userProfile_${user.uid}`);
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
