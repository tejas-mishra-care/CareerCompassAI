'use client';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';
import type { FirebaseServices } from '.';


export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const services = useMemo(() => {
    // This check ensures Firebase is initialized only on the client-side.
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []);

  // Render children only after Firebase has been initialized on the client
  if (!services) {
    // You can render a loader here if needed
    return null;
  }

  return (
    <FirebaseProvider {...services}>
      {children}
    </FirebaseProvider>
  );
}
