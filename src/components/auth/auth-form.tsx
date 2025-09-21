
'use client';

import * as React from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function AuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSignUp, setIsSignUp] = React.useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const auth = getAuth(app);
  
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    setIsLoading(true);
    try {
        if (isSignUp) {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            toast({
                title: 'Welcome Aboard!',
                description: "Let's start building your future.",
            });
        } else {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            toast({
                title: 'Welcome Back!',
                description: 'Your career journey continues.',
            });
        }
        router.push('/dashboard');
    } catch (error: any) {
        let title = 'Authentication Failed';
        let description = 'An unexpected error occurred. Please try again.';

        switch (error.code) {
            case 'auth/email-already-in-use':
                title = 'Email Already Registered';
                description = 'An account with this email already exists. Please try signing in.';
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                title = 'Invalid Credentials';
                description = 'The email or password you entered is incorrect. Please check and try again.';
                break;
            case 'auth/weak-password':
                title = 'Weak Password';
                description = 'Your password is too weak. Please choose a password that is at least 8 characters long.';
                break;
            default:
                // Keep the generic message for other errors
                break;
        }

        toast({
            variant: 'destructive',
            title: title,
            description: description,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSignUp ? 'Sign up with Email' : 'Sign in with Email'}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
      </div>
    </div>
  );

}