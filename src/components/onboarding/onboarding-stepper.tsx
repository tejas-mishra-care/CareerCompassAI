
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Placeholder components for each step
const Step1Foundation = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <div>
        <h3 className="font-semibold mb-4">Step 1: Your Foundation</h3>
        <p className="text-muted-foreground mb-4">Form for Academics & Early Sparks will go here.</p>
        <Button onClick={() => onComplete({ step1: 'data' })}>Next</Button>
    </div>
);

const Step2DeepDive = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <div>
        <h3 className="font-semibold mb-4">Step 2: Subject-Level Deep Dive</h3>
        <p className="text-muted-foreground mb-4">Form for Subject Scores & Feelings will go here.</p>
        <Button onClick={() => onComplete({ step2: 'data' })}>Next</Button>
    </div>
);

const Step3Quiz = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <div>
        <h3 className="font-semibold mb-4">Step 3: The Adaptive Knowledge Quiz</h3>
        <p className="text-muted-foreground mb-4">The adaptive quiz will be generated here.</p>
        <Button onClick={() => onComplete({ step3: 'data' })}>Next</Button>
    </div>
);

const Step4Direction = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <div>
        <h3 className="font-semibold mb-4">Step 4: Defining Your Direction</h3>
        <p className="text-muted-foreground mb-4">Form for user goals and motivations will go here.</p>
        <Button onClick={() => onComplete({ step4: 'data' })}>Finish</Button>
    </div>
);


export function OnboardingStepper() {
  const { userProfile, setUserProfile } = useUserProfile();
  const { toast } = useToast();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleStepComplete = (data: any) => {
    const newData = { ...onboardingData, ...data };
    setOnboardingData(newData);
    
    if (step === 4) {
      handleFinish(newData);
    } else {
      setStep(step + 1);
    }
  };

  const handleFinish = async (finalData: any) => {
    if (!userProfile) return;
    setLoading(true);
    
    console.log("Final onboarding data to be processed by AI:", finalData);
    
    try {
        // In the next step, we will replace this with a call to the AI flow.
        // For now, we'll just mark the profile as complete.
        const generatedProfile = {
            ...userProfile,
            name: userProfile.name || 'New User',
            bio: 'Profile created from the new onboarding flow!',
            skills: [{ name: 'Initial Skill', proficiency: 20 }], // Placeholder
            activePathways: [],
        };
        
        await setUserProfile(generatedProfile);

        toast({
            title: "Profile Calibrated!",
            description: "Your new AI-powered profile is ready.",
        });

        router.push('/dashboard');

    } catch (error) {
        console.error("Failed to create profile:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not create your profile.',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="py-4 space-y-6 min-h-[300px]">
      {step === 1 && <Step1Foundation onComplete={handleStepComplete} />}
      {step === 2 && <Step2DeepDive onComplete={handleStepComplete} />}
      {step === 3 && <Step3Quiz onComplete={handleStepComplete} />}
      {step === 4 && <Step4Direction onComplete={handleStepComplete} />}
    </div>
  );
}
