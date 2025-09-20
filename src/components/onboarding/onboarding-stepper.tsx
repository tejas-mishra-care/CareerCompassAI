'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Smile, Meh, Frown } from 'lucide-react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

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

const subjectSchema = z.object({
    score: z.string().min(1, "Score is required."),
    feeling: z.enum(['loved', 'okay', 'disliked'], { required_error: "Please select a feeling."}),
});

const deepDiveSchema = z.object({
    subjects: z.record(subjectSchema)
});


// --- Step Components ---

const Step1Foundation = ({ onComplete }: { onComplete: (data: z.infer<typeof foundationSchema>) => void }) => {
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

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onComplete)} className="space-y-8">
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
                
                <div className="flex justify-end pt-4">
                    <Button type="submit">Next</Button>
                </div>
            </form>
        </FormProvider>
    );
};

const STREAM_SUBJECTS: Record<string, string[]> = {
    pcm: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    pcb: ['Physics', 'Chemistry', 'Biology', 'English'],
    commerce: ['Accountancy', 'Business Studies', 'Economics', 'English'],
    arts: ['History', 'Political Science', 'Sociology', 'English'],
    diploma: ['Engineering Mathematics', 'Applied Physics', 'Applied Chemistry', 'Communication Skills'],
    default: ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4', 'Subject 5'],
}

const Step2DeepDive = ({ onComplete, previousData }: { onComplete: (data: any) => void, previousData: any }) => {
    const stream = previousData.stream12th || 'default';
    const subjects = STREAM_SUBJECTS[stream] || STREAM_SUBJECTS.default;

    const defaultValues = subjects.reduce((acc, subject) => {
        acc[subject] = { score: '', feeling: '' };
        return acc;
    }, {} as Record<string, { score: string, feeling: string }>);

    const methods = useForm({
        // resolver: zodResolver(deepDiveSchema), // Add validation later
        defaultValues: { subjects: defaultValues }
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onComplete)} className="space-y-8">
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Subject-Level Deep Dive</h3>
                    <p className="text-sm text-muted-foreground mb-4">This is where we deconstruct the average score to find the real story. For each subject, tell us your score and how you *really* felt about it.</p>
                </div>

                <div className="space-y-6">
                    {subjects.map((subject) => (
                        <Card key={subject} className="bg-secondary/50">
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <FormLabel className="text-base font-semibold md:col-span-1">{subject}</FormLabel>
                                
                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                     <FormField
                                        control={methods.control}
                                        name={`subjects.${subject}.score`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Score (%)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., 95" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        control={methods.control}
                                        name={`subjects.${subject}.feeling`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Feeling</FormLabel>
                                                <div className="flex items-center space-x-2 pt-2">
                                                    <Button type="button" variant={field.value === 'loved' ? 'default' : 'outline'} size="icon" onClick={() => field.onChange('loved')}><Smile className="h-5 w-5" /></Button>
                                                    <Button type="button" variant={field.value === 'okay' ? 'default' : 'outline'} size="icon" onClick={() => field.onChange('okay')}><Meh className="h-5 w-5" /></Button>
                                                    <Button type="button" variant={field.value === 'disliked' ? 'default' : 'outline'} size="icon" onClick={() => field.onChange('disliked')}><Frown className="h-5 w-5" /></Button>
                                                </div>
                                                 <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                
                <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost">Back</Button>
                    <Button type="submit">Next</Button>
                </div>
            </form>
        </FormProvider>
    )
};


const Step3Quiz = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <div>
        <h3 className="font-semibold mb-4">Step 3: The Adaptive Knowledge Quiz</h3>
        <p className="text-muted-foreground mb-4">The adaptive quiz will be generated here.</p>
        <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost">Back</Button>
            <Button onClick={() => onComplete({ step3: 'data' })}>Next</Button>
        </div>
    </div>
);

const Step4Direction = ({ onComplete }: { onComplete: (data: any) => void }) => (
    <div>
        <h3 className="font-semibold mb-4">Step 4: Defining Your Direction</h3>
        <p className="text-muted-foreground mb-4">Form for user goals and motivations will go here.</p>
        <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost">Back</Button>
            <Button onClick={() => onComplete({ step4: 'data' })}>Finish</Button>
        </div>
    </div>
);


export function OnboardingStepper() {
  const { userProfile, setUserProfile } = useUserProfile();
  const { toast } = useToast();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<any>({});
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
  
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  }


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
        return <Step2DeepDive onComplete={handleStepComplete} previousData={onboardingData} />;
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
