
'use client';

import { AuthForm } from "@/components/auth/auth-form";
import { BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import placeholderImagesData from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/types';


export default function LoginPage() {
    const welcomeImages = (placeholderImagesData as ImagePlaceholder[]).filter(p => p.id.startsWith('welcome'));

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <Carousel
            className="absolute inset-0"
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
            opts={{ loop: true }}
        >
            <CarouselContent className="h-full" data-embla-container>
                {welcomeImages.map((image, index) => (
                    <CarouselItem key={index} className="h-full">
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            data-ai-hint={image.imageHint}
                            fill
                            className="object-cover"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>

        <div className="absolute inset-0 bg-zinc-900/60" />

        <div className="relative z-20 flex items-center text-lg font-medium font-headline">
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
