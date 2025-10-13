
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import placeholderImagesData from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/types';
import { BrainCircuit } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRouter } from 'next/navigation';


export default function LandingPage() {
  const welcomeImages = (placeholderImagesData as ImagePlaceholder[]).filter(p => p.id.startsWith('welcome'));
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="sr-only">CareerCompassAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" onClick={() => router.push('/login')}>Sign In</Button>
          <Button onClick={() => router.push('/login')}>Get Started</Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8">
              {welcomeImages.length > 0 ? (
                <Carousel
                  className="w-full max-w-3xl"
                  plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
                  opts={{ loop: true }}
                >
                  <CarouselContent>
                    {welcomeImages.map((image, index) => (
                      <CarouselItem key={image.id}>
                          <div className="aspect-video relative">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                data-ai-hint={image.imageHint}
                                className="mx-auto overflow-hidden rounded-xl object-cover"
                                priority={index === 0}
                            />
                          </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex left-[-2.5rem]" />
                  <CarouselNext className="hidden sm:flex right-[-2.5rem]" />
                </Carousel>
              ) : (
                <div className="w-full max-w-3xl aspect-video bg-muted rounded-xl flex items-center justify-center">
                  <p className="text-muted-foreground">Your images will appear here.</p>
                </div>
              )}
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Unlock Your Future Career.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CareerCompassAI is your personal AI navigator. Discover your skills, explore options, and build a concrete path to your goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
