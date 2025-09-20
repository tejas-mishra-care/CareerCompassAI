
'use client';

import * as React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthForm({ className, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Explicitly setting the auth domain for the provider can resolve redirect issues.
      // Also ensure we're not using a tenant ID which can cause this error.
      auth.tenantId = null; 
      provider.setCustomParameters({
        authDomain: 'studio-9295250327-e0fca.firebaseapp.com'
      });

      await signInWithPopup(auth, provider);
      // The auth state change will be handled by the useUserProfile hook,
      // which will then trigger a redirect from the AppShell.
      router.push('/dashboard');
      toast({
        title: 'Success!',
        description: 'You have successfully signed in.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
            <svg className="mr-2 h-4 w-4" role="img" viewBox="0 0 24 24">
                <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.58 3.18-5.62 3.18-4.75 0-8.62-3.87-8.62-8.62s3.87-8.62 8.62-8.62c2.75 0 4.38 1.12 5.38 2.12l2.62-2.62C18.62 2.25 15.88 1 12.48 1 5.88 1 1 5.88 1 12s4.88 11 11.48 11c6.48 0 11.02-4.56 11.02-11.12 0-.75-.06-1.5-.18-2.25H12.48z"
                fill="currentColor"
                />
            </svg>
        )}
        Google
      </Button>
    </div>
  );
}
