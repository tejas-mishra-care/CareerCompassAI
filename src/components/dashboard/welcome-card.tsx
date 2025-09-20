
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useRouter } from 'next/navigation';

export function WelcomeCard() {
  const router = useRouter();
  const welcomeImage = placeholderImages.find(p => p.id === 'welcome');

  return (
      <Card>
        <div className="grid md:grid-cols-2 items-center">
            <div className="p-6">
                <CardHeader className="p-0 pb-4">
                    <CardTitle className="font-headline text-2xl">
                    Welcome to CareerCompassAI!
                    </CardTitle>
                    <CardDescription>
                    Let's chart your course to a brighter future. Complete your profile to unlock personalized career insights and recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Button onClick={() => router.push('/profile')}>Get Started</Button>
                </CardContent>
            </div>
            {welcomeImage && (
                <div className="p-6 hidden md:flex justify-center items-center">
                    <Image
                        src={welcomeImage.imageUrl}
                        alt={welcomeImage.description}
                        width={300}
                        height={300}
                        data-ai-hint={welcomeImage.imageHint}
                        className="rounded-lg object-cover"
                    />
                </div>
            )}
        </div>
      </Card>
  );
}
