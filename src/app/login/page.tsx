
import { AuthForm } from "@/components/auth/auth-form";
import { BrainCircuit } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <BrainCircuit className="mr-2 h-6 w-6" />
          CareerCompassAI
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The best way to predict the future is to create it.&rdquo;
            </p>
            <footer className="text-sm">Abraham Lincoln</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to your dashboard
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
