
'use client';

import { AuthForm } from "@/components/auth/auth-form";
import { BrainCircuit } from "lucide-react";
import dynamic from 'next/dynamic';

const LoginCarousel = dynamic(() => import('@/components/auth/login-carousel').then(mod => mod.LoginCarousel), { ssr: false });

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <LoginCarousel />
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
    </div>
  );
}
// Updated
