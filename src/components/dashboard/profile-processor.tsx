
'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { createProfileFromOnboarding } from '@/ai/flows/create-profile-from-onboarding';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Button } from '../ui/button';

export function ProfileProcessor() {
  const { user, userProfile, setUserProfile } = useUserProfile();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processProfile = async () => {
    if (!userProfile || !userProfile.onboardingData || !user) {
        setIsProcessing(false);
        return;
    };

    // Prevent re-processing if skills are already populated
    if (userProfile.skills && userProfile.skills.length > 0) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const data = userProfile.onboardingData;
      
      const answers = Object.keys(data).map(key => ({
          question: key,
          answer: JSON.stringify(data[key]),
      }));

      const generatedProfile = await createProfileFromOnboarding({ 
          answers,
          userName: user.displayName || userProfile.name 
      });

      const finalProfile: UserProfile = {
        ...userProfile,
        name: generatedProfile.name,
        bio: generatedProfile.bio,
        skills: generatedProfile.skills,
        // Promote key fields for querying
        stream12th: userProfile.onboardingData?.stream12th,
        goal: userProfile.onboardingData?.goal,
      };
      
      await setUserProfile(finalProfile);

      toast({
        title: "Your Profile is Ready!",
        description: "We've created your personalized dashboard.",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error("Failed to process profile:", err);
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error Building Profile',
        description: 'There was an issue creating your profile with AI.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Automatically trigger on mount if needed
    processProfile();
  // We only want this to run when the component mounts and userProfile is available
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile?.onboardingData]);


  if (error) {
    return (
        <Card>
            <CardHeader className="text-center">
                <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="mt-4">Error Calibrating</CardTitle>
                <CardDescription>
                We had trouble analyzing your profile. Please try again.
                </CardDescription>
            </CardHeader>
             <CardContent>
                <p className="text-xs text-center text-muted-foreground p-2 bg-secondary rounded-md">{error}</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={processProfile} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Try Again
                </Button>
            </CardFooter>
        </Card>
    )
  }

  if (isProcessing) {
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

  return null;
}
// Updated
