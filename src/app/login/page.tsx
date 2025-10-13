
'use client';

import { AuthForm } from "@/components/auth/auth-form";
import { BrainCircuit } from "lucide-react";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const LoginCarousel = dynamic(() => import('@/components/auth/login-carousel').then(mod => mod.LoginCarousel), { 
  ssr: false,
  loading: () => <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"></div>
});

const LoginForm = () => (
  <div className="lg:p-8">
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight font-headline">
          Create an account or sign in
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account or sign in
        </p>
      </div>
      <AuthForm />
    </div>
  </div>
);

const ClientOnlyLoginPage = dynamic(() => Promise.resolve(LoginForm), {
  ssr: false,
  loading: () => (
     <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
             <Skeleton className="h-8 w-3/4 mx-auto" />
             <Skeleton className="h-4 w-full mx-auto" />
          </div>
           <div className="space-y-4 pt-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
               <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
           </div>
        </div>
      </div>
  )
});


export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <LoginCarousel />
      <ClientOnlyLoginPage />
    </div>
  );
}
