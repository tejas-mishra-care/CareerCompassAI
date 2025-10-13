'use client';
import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import type { FirebaseServices } from '.';

export function useFirebase() {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useMemo(() => {
    if (typeof window !== 'undefined' && !services) {
      const { initializeFirebase } = require('.') as {
        initializeFirebase: () => FirebaseServices;
      };
      setServices(initializeFirebase());
    }
  }, [services]);

  return services;
}

export function FirebaseClientProvider({ children, ...props }: { children: ReactNode } & FirebaseServices) {
  const services = useFirebase();

  if (!services) {
    return null;
  }

  return (
    <FirebaseProvider {...services}>
      {children}
    </FirebaseProvider>
  );
}
