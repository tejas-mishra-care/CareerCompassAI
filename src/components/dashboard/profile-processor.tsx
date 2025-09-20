
'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { createProfileFromOnboarding } from '@/ai/flows/create-profile-from-onboarding';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

export function ProfileProcessor() {
  const { user, userProfile, setUserProfile } = useUserProfile();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processProfile = async () => {
      if (!userProfile || !userProfile.onboardingData || !user) return;

      // Prevent re-processing if skills are already populated
      if (userProfile.skills && userProfile.skills.length > 0) {
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);
      try {
        const answers = [
            { question: "Academics and Achievements", answer: JSON.stringify(userProfile.onboardingData) },
            { question: "Subject Deep Dive", answer: JSON.stringify(userProfile.onboardingData.subjects || {}) },
            { question: "Aptitude Quiz", answer: JSON.stringify(userProfile.onboardingData.quizAnswers || {}) },
            { question: "Primary Goal", answer: userProfile.onboardingData.goal || "" },
        ];
        
        const generatedProfile = await createProfileFromOnboarding({ 
            answers,
            userName: user.displayName || userProfile.name 
        });

        const finalProfile: UserProfile = {
          ...userProfile,
          name: generatedProfile.name,
          bio: generatedProfile.bio,
          skills: generatedProfile.skills,
        };
        
        await setUserProfile(finalProfile);

        toast({
          title: "Your Profile is Ready!",
          description: "We've created your personalized dashboard.",
        });
      } catch (error) {
        console.error("Failed to process profile:", error);
        toast({
          variant: 'destructive',
          title: 'Error Building Profile',
          description: 'There was an issue creating your profile with AI. Please try again later.',
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile?.onboardingData]);

  if (!isProcessing) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calibrating Your Compass</CardTitle>
        <CardDescription>
          Our AI is analyzing your unique background and goals to build your personalized career dashboard. This may take a moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-semibold">Processing your data...</p>
      </CardContent>
    </Card>
  );
}
