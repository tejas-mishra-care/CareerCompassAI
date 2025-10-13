
'use client';

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import placeholderImagesData from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/types';
import { BrainCircuit } from "lucide-react";

export function LoginCarousel() {
    const welcomeImages = (placeholderImagesData as ImagePlaceholder[]).filter(p => p.id.startsWith('welcome'));

    return (
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
            <Carousel
                className="absolute inset-0"
                plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
                opts={{ loop: true }}
            >
                <CarouselContent className="h-full">
                    {welcomeImages.map((image, index) => (
                        <CarouselItem key={index} className="h-full">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                data-ai-hint={image.imageHint}
                                fill
                                className="object-cover"
                                priority={index === 0} // Prioritize loading the first image
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
    );
}
// Updated
