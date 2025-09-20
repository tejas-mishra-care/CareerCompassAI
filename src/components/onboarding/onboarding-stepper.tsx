
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Smile, Meh, Frown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { createProfileFromOnboarding } from '@/ai/flows/create-profile-from-onboarding';
import type { UserProfile } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';


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

const quizSchema = z.object({
  quizAnswers: z.record(z.string().min(1, "Please select an answer."))
});

const directionSchema = z.object({
  goal: z.string({
    required_error: "Please select a goal to continue."
  })
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
                    <Button type="submit">Next <ChevronRight className="ml-2" /></Button>
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
    default: ['Science', 'Mathematics', 'Social Studies', 'English', 'Second Language'],
}

const Step2DeepDive = ({ onComplete, onBack, previousData }: { onComplete: (data: any) => void, onBack: () => void, previousData: any }) => {
    const stream = previousData.stream12th || 'default';
    const subjects = STREAM_SUBJECTS[stream] || STREAM_SUBJECTS.default;

    const defaultValues = subjects.reduce((acc, subject) => {
        acc[subject] = { score: '', feeling: undefined };
        return acc;
    }, {} as Record<string, { score: string, feeling: 'loved' | 'okay' | 'disliked' | undefined }>);

    const methods = useForm({
        defaultValues: { subjects: defaultValues }
    });
    
    const { control, handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onComplete)} className="space-y-8">
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Subject-Level Deep Dive</h3>
                    <p className="text-sm text-muted-foreground mb-4">This is where we deconstruct the average score to find the real story. For each subject, tell us your score and how you *really* felt about it.</p>
                </div>

                <div className="space-y-6">
                    {subjects.map((subject) => (
                        <Card key={subject} className="bg-card">
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <FormLabel className="text-base font-semibold md:col-span-1">{subject}</FormLabel>
                                
                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                     <FormField
                                        control={control}
                                        name={`subjects.${subject}.score`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Score (%)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., 95" {...field} id={`score-${subject}`} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        control={control}
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
                    <Button type="button" variant="ghost" onClick={onBack}><ChevronLeft className="mr-2" /> Back</Button>
                    <Button type="submit">Next <ChevronRight className="ml-2" /></Button>
                </div>
            </form>
        </FormProvider>
    )
};


const QUIZ_QUESTIONS = [
    {
        id: 'q1',
        question: "You have a free weekend. What's the most appealing project?",
        options: ["Building a custom PC from parts.", "Writing a short story or a poem.", "Organizing a small community clean-up drive.", "Analyzing your monthly spending in a spreadsheet."]
    },
    {
        id: 'q2',
        question: "A client gives you a vague brief for a new logo. What's your first step?",
        options: ["Start sketching ideas immediately to show them options.", "Ask a series of questions to understand their business and target audience.", "Research their competitors to see what's already out there.", "Decline the project because the brief is too unclear."]
    },
    {
        id: 'q3',
        question: "You are planning a trip. What's your approach?",
        options: ["Create a detailed itinerary with a budget for each day.", "Just book the tickets and figure it out when you get there.", "Ask friends for recommendations and pick the most interesting ones.", "Look for the most unusual, off-the-beaten-path destination."]
    }
]

const Step3Quiz = ({ onComplete, onBack }: { onComplete: (data: any) => void, onBack: () => void }) => {
    const defaultValues = QUIZ_QUESTIONS.reduce((acc, q) => {
        acc[q.id] = '';
        return acc;
    }, {} as Record<string, string>);
    
    const methods = useForm({
        defaultValues: { quizAnswers: defaultValues }
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onComplete)} className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">The Profile Scanner</h3>
                    <p className="text-sm text-muted-foreground mb-4">Let's calibrate your Compass. This isn't a test; it's a quick challenge to discover your hidden strengths.</p>
                </div>

                <div className="space-y-6">
                    {QUIZ_QUESTIONS.map((q) => (
                        <FormField
                            key={q.id}
                            control={methods.control}
                            name={`quizAnswers.${q.id}`}
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base">{q.question}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            {q.options.map((option, index) => (
                                                <FormItem key={index} className="flex items-center space-x-3 space-y-0 p-3 rounded-md border has-[:checked]:bg-accent">
                                                    <FormControl>
                                                        <RadioGroupItem value={option} id={`${q.id}-${index}`} />
                                                    </FormControl>
                                                    <Label htmlFor={`${q.id}-${index}`} className="font-normal flex-1 cursor-pointer">
                                                        {option}
                                                    </Label>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={onBack}><ChevronLeft className="mr-2" /> Back</Button>
                    <Button type="submit">Next <ChevronRight className="ml-2" /></Button>
                </div>
            </form>
        </FormProvider>
    )
};


const GOAL_OPTIONS = [
    { id: 'dream_career', title: "I have a dream career", description: "You have a specific job title in mind." },
    { id: 'field_of_interest', title: "I have a field of interest", description: "You're interested in a broad area like 'Technology' or 'Healthcare'." },
    { id: 'earn_well', title: "I want to earn well", description: "Financial security is your primary motivator right now." },
    { id: 'exploring', title: "I'm just exploring", description: "You're open to discovering new and different paths." },
    { id: 'entrance_exam', title: "I'm focused on an exam", description: "You're preparing for a competitive entrance exam." },
]

const Step4Direction = ({ onComplete, onBack }: { onComplete: (data: z.infer<typeof directionSchema>) => void, onBack: () => void }) => {
    const methods = useForm<z.infer<typeof directionSchema>>({
        resolver: zodResolver(directionSchema),
        defaultValues: { goal: '' }
    });
    
    const { control, handleSubmit, watch } = methods;
    const selectedGoal = watch('goal');

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onComplete)} className="space-y-8">
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Defining Your Direction</h3>
                    <p className="text-sm text-muted-foreground mb-4">Now that we understand your past and present, let's look to the future. What is your main goal right now?</p>
                </div>
                <FormField
                  control={control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {GOAL_OPTIONS.map((option) => (
                            <FormItem key={option.id}>
                                <Label
                                htmlFor={option.id}
                                className={cn(
                                    "flex flex-col h-full items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                    field.value === option.title
                                    ? "border-primary bg-accent"
                                    : "border-muted bg-popover"
                                )}
                                >
                                <FormControl>
                                    <RadioGroupItem value={option.title} id={option.id} className="sr-only" />
                                </FormControl>
                                <h4 className="font-semibold mb-1">{option.title}</h4>
                                <p className="text-sm text-muted-foreground text-center">{option.description}</p>
                              </Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" onClick={onBack}><ChevronLeft className="mr-2" /> Back</Button>
                    <Button type="submit">Finish</Button>
                </div>
            </form>
        </FormProvider>
    )
};


export function OnboardingStepper() {
  const { user, userProfile, setUserProfile } = useUserProfile();
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
      setStep(s => s + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(s => s - 1);
    }
  }

  const handleFinish = async (finalData: any) => {
    if (!user || !userProfile) return;
    setLoading(true);
    
    const answers = [
        { question: "Academics and Achievements", answer: JSON.stringify(finalData.foundation || {}) },
        { question: "Subject Deep Dive", answer: JSON.stringify(finalData.subjects || {}) },
        { question: "Aptitude Quiz", answer: JSON.stringify(finalData.quizAnswers || {}) },
        { question: "Primary Goal", answer: finalData.goal || "" },
    ];
    
    try {
        const generatedProfile = await createProfileFromOnboarding({
            answers,
            userName: user.displayName || userProfile.name,
        });

        const finalProfile: UserProfile = {
            ...userProfile,
            name: generatedProfile.name,
            bio: generatedProfile.bio,
            skills: generatedProfile.skills,
            activePathways: userProfile.activePathways || [],
        };
        
        await setUserProfile(finalProfile);

        toast({
            title: "Compass Calibrated!",
            description: "Your new AI-powered profile is ready.",
        });

        router.push('/dashboard');

    } catch (error) {
        console.error("Failed to create profile:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not create your profile from your answers.',
        });
    } finally {
        setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return <Step1Foundation onComplete={(data) => handleStepComplete({ foundation: data })} />;
      case 2:
        return <Step2DeepDive onComplete={(data) => handleStepComplete(data)} onBack={goToPreviousStep} previousData={onboardingData.foundation || {}} />;
      case 3:
        return <Step3Quiz onComplete={(data) => handleStepComplete(data)} onBack={goToPreviousStep} />;
      case 4:
        return <Step4Direction onComplete={(data) => handleStepComplete(data)} onBack={goToPreviousStep} />;
      default:
        return <Step1Foundation onComplete={(data) => handleStepComplete({ foundation: data })} />;
    }
  }

  return (
    <div className="py-4 space-y-6 min-h-[300px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center text-center space-y-2 h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-semibold">Calibrating Your Compass...</p>
            <p className="text-sm text-muted-foreground">This may take a moment. We're analyzing your unique path!</p>
        </div>
      ) : (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">
                    Step {step}: {
                        step === 1 ? "Your Foundation" :
                        step === 2 ? "Subject-Level Deep Dive" :
                        step === 3 ? "The Profile Scanner" : "Defining Your Direction"
                    }
                </h3>
                 <p className="text-sm text-muted-foreground">
                    Step {step} of 4
                </p>
            </div>
            {renderStep()}
        </>
      )}
    </div>
  );
}
