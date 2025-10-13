
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * A client component that listens for globally emitted 'permission-error' events
 * and displays a toast notification. In a dev environment, it also throws the
 * error to make it visible in the Next.js error overlay for easy debugging.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error("Caught a Firestore permission error:", error);
      
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'You do not have permission to perform this action.',
      });

      // In a development environment, we want to see the full error overlay
      if (process.env.NODE_ENV === 'development') {
        // Throwing the error here will cause it to be picked up by the Next.js
        // error overlay, which is exactly what we want for debugging.
        throw error;
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
