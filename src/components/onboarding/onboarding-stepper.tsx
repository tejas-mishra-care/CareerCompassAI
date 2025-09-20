'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';

// --- Validation Schemas ---
const foundationSchema = z.object({
  board10th: z.string().min(1, "Please select your 10th standard board."),
  year10th: z.string().min(4, "Please enter a valid year.").max(4),
  score10th: z.string().min(1, "Please enter your score."),
  stream12th: z.string().optional(),
  board12th: z.string().optional(),
  year12th: z.string().optional(),
  score12th: z.string().optional(),
  achievements: z.string().optional(),
});

// --- Step Components ---

const Step1Foundation = ({ onComplete }: { onComplete: (data: any) => void }) => {
    const methods = useForm<z.infer<typeof foundationSchema>>({
        resolver: zodResolver(foundationSchema),
        defaultValues: {
            board10th: '',
            year10th: '',
            score10th: '',
            stream12th: '',
            board12th: '',
            year12th: '',
            score12th: '',
            achievements: '',
        }
    });

    const onSubmit = (data: z.infer<typeof foundationSchema>) => {
        onComplete(data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">10th Standard Details</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormField
                            control={methods.control}
                            name="board10th"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Board</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="cbse">CBSE</SelectItem>
                                            <SelectItem value="icse">ICSE</SelectItem>
                                            <SelectItem value="state">State Board</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={methods.control}
                            name="year10th"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year of Passing</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 2020" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={methods.control}
                            name="score10th"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Overall Score (%)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 85" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">12th Standard / Diploma (if applicable)</h3>
                     <div className="grid md:grid-cols-4 gap-6">
                         <FormField
                            control={methods.control}
                            name="stream12th"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stream</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select Stream" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pcm">Science (PCM)</SelectItem>
                                            <SelectItem value="pcb">Science (PCB)</SelectItem>
                                            <SelectItem value="commerce">Commerce</SelectItem>
                                            <SelectItem value="arts">Arts/Humanities</SelectItem>
                                            <SelectItem value="diploma">Diploma</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={methods.control}
                            name="board12th"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Board</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="cbse">CBSE</SelectItem>
                                            <SelectItem value="icse">ICSE</SelectItem>
                                            <SelectItem value="state">State Board</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={methods.control}
                            name="year12th"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year of Passing</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 2022" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={methods.control}
                            name="score12th"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Overall Score (%)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 90" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                 <div>
                    <h3 className="text-lg font-semibold mb-2">Your Early Achievements (The "Spark" Finder)</h3>
                    <p className="text-sm text-muted-foreground mb-4">Think back to your school days. What were you known for? What did you enjoy doing? (e.g., Olympiads, Debate, Coding, Sports, Art, Leadership)</p>
                     <FormField
                        control={methods.control}
                        name="achievements"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="List a few of your passions or achievements..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="flex justify-end">
                    <Button type="submit">Next</Button>
                </div>
            </form>
        </FormProvider>
    );
};

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

  const renderStep = () => {
    switch(step) {
      case 1:
        return <Step1Foundation onComplete={handleStepComplete} />;
      case 2:
        return <Step2DeepDive onComplete={handleStepComplete} />;
      case 3:
        return <Step3Quiz onComplete={handleStepComplete} />;
      case 4:
        return <Step4Direction onComplete={handleStepComplete} />;
      default:
        return <Step1Foundation onComplete={handleStepComplete} />;
    }
  }

  return (
    <div className="py-4 space-y-6 min-h-[300px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-semibold">Building your profile...</p>
            <p className="text-sm text-muted-foreground">This will just take a moment.</p>
        </div>
      ) : renderStep()}
    </div>
  );
}
