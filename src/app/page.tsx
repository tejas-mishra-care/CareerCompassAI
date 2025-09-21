
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import placeholderImagesData from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { BrainCircuit, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


export default function LandingPage() {
  const welcomeImages = (placeholderImagesData as ImagePlaceholder[]).filter(p => p.id.startsWith('welcome'));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="sr-only">CareerCompassAI</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
               <Carousel 
                className="w-full max-w-full mx-auto lg:order-last"
                plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {welcomeImages.map((image) => (
                    <CarouselItem key={image.id}>
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            width={600}
                            height={400}
                            data-ai-hint={image.imageHint}
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                        />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Stop Guessing. Start Building Your Future.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CareerCompassAI is your personal AI navigator for the complex world of careers. Discover your skills, explore your options, and build a concrete path to your goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Discover Your Path (It's Free)
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
