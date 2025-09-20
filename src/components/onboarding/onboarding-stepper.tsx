'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Smile, Meh, Frown, ChevronLeft } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

const subjectSchema = z.object({
    score: z.string().min(1, "Score is required.").max(3, "Invalid score."),
    feeling: z.enum(['loved', 'okay', 'disliked'], { required_error: "Please select a feeling."}),
});

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
];

const GOAL_OPTIONS = [
    { id: 'dream_career', title: "I have a dream career", description: "You have a specific job title in mind." },
    { id: 'field_of_interest', title: "I have a field of interest", description: "You're interested in a broad area like 'Technology' or 'Healthcare'." },
    { id: 'earn_well', title: "I want to earn well", description: "Financial security is your primary motivator right now." },
    { id: 'exploring', title: "I'm just exploring", description: "You're open to discovering new and different paths." },
    { id: 'entrance_exam', title: "I'm focused on an exam", description: "You're preparing for a competitive entrance exam." },
];

const STREAM_SUBJECTS: Record<string, string[]> = {
    pcm: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    pcb: ['Physics', 'Chemistry', 'Biology', 'English'],
    commerce: ['Accountancy', 'Business Studies', 'Economics', 'English'],
    arts: ['History', 'Political Science', 'Sociology', 'English'],
    diploma: ['Engineering Mathematics', 'Applied Physics', 'Applied Chemistry', 'Communication Skills'],
    default: ['Science', 'Mathematics', 'Social Studies', 'English', 'Second Language'],
};

const generateDefaultValues = (stream: string = 'default') => {
    const subjectsForStream = STREAM_SUBJECTS[stream] || STREAM_SUBJECTS.default;
    const defaultSubjects = subjectsForStream.reduce((acc, subject) => {
      acc[subject] = { score: '', feeling: undefined };
      return acc;
    }, {} as Record<string, { score: string; feeling?: 'loved' | 'okay' | 'disliked' }>);
  
    const defaultQuizAnswers = QUIZ_QUESTIONS.reduce((acc, q) => {
      acc[q.id] = '';
      return acc;
    }, {} as Record<string, string>);
  
    return {
        board10th: '',
        year10th: '',
        score10th: '',
        stream12th: '',
        board12th: '',
        year12th: '',
        score12th: '',
        achievements: '',
        subjects: defaultSubjects,
        quizAnswers: defaultQuizAnswers,
        goal: '',
    };
  };

const onboardingSchema = z.object({
    board10th: z.string().min(1, "Please select your 10th standard board."),
    year10th: z.string().min(4, "Please enter a valid year.").max(4),
    score10th: z.string().min(1, "Please enter your score."),
    stream12th: z.string().optional(),
    board12th: z.string().optional(),
    year12th: z.string().optional(),
    score12th: z.string().optional(),
    achievements: z.string().optional(),
    subjects: z.record(subjectSchema).refine(
      (subjects) => Object.values(subjects).every(subject => subject.score && subject.feeling),
      { message: "Please fill out all fields for each subject." }
    ),
    quizAnswers: z.record(z.string().min(1, "Please select an answer.")).refine(
      (answers) => Object.keys(answers).length >= QUIZ_QUESTIONS.length,
      { message: "Please answer all quiz questions." }
    ),
    goal: z.string({ required_error: "Please select a goal to continue." }).min(1, "Please select a goal to continue."),
  });

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function OnboardingStepper() {
  const { userProfile, setUserProfile } = useUserProfile();
  const { toast } = useToast();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: generateDefaultValues(),
    mode: 'onChange',
  });
  
  const { trigger } = methods;

  const watchedStream = methods.watch('stream12th') || 'default';
  const subjects = useMemo(() => STREAM_SUBJECTS[watchedStream] || STREAM_SUBJECTS.default, [watchedStream]);

  React.useEffect(() => {
    const defaultSubjects = (STREAM_SUBJECTS[watchedStream] || STREAM_SUBJECTS.default).reduce((acc, subject) => {
        acc[subject] = { score: '', feeling: undefined as any };
        return acc;
    }, {} as any);
    methods.setValue('subjects', defaultSubjects);
  }, [watchedStream, methods]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingFormData | `subjects.${string}.score` | `subjects.${string}.feeling` | `quizAnswers.${string}`)[] = [];
    if (step === 1) fieldsToValidate = ['board10th', 'year10th', 'score10th'];
    if (step === 2) {
      fieldsToValidate = subjects.flatMap(s => [`subjects.${s}.score`, `subjects.${s}.feeling`]);
    }
    if (step === 3) {
      fieldsToValidate = QUIZ_QUESTIONS.map(q => `quizAnswers.${q.id}`);
    }
    
    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid) {
      setStep(s => s + 1);
    } else {
        toast({ variant: 'destructive', title: 'Please complete all required fields.' });
    }
  };
  
  const handleBack = () => step > 1 && setStep(s => s - 1);

  const handleFinish = async (data: OnboardingFormData) => {
    if (!userProfile) return;
    setLoading(true);

    try {
      // Just save the raw data and redirect. Processing will happen on the dashboard.
      setUserProfile({
        ...userProfile,
        onboardingData: data,
        onboardingCompleted: true,
      });

      toast({
        title: "Profile Data Saved!",
        description: "Redirecting to your dashboard to build your profile.",
      });

      router.push('/dashboard');
    } catch (error) {
        console.error("Failed to save onboarding data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save your progress. Please try again.' });
        setLoading(false);
    }
  };
  
  const totalSteps = 4;
  const isFinalStep = step === totalSteps;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFinish)} className="py-4 space-y-8">
        <Progress value={(step / totalSteps) * 100} className="w-full mb-8" />
        
          <div className="min-h-[450px]">
            <div className={cn("space-y-8", step !== 1 && "hidden")}>
                 <div>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">10th Standard Details</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormField control={methods.control} name="board10th" render={({ field }) => (
                            <FormItem><FormLabel>Board</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger></FormControl><SelectContent><SelectItem value="cbse">CBSE</SelectItem><SelectItem value="icse">ICSE</SelectItem><SelectItem value="state">State Board</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                         <FormField control={methods.control} name="year10th" render={({ field }) => (
                            <FormItem><FormLabel>Year of Passing</FormLabel><FormControl><Input placeholder="e.g., 2020" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={methods.control} name="score10th" render={({ field }) => (
                            <FormItem><FormLabel>Overall Score (%)</FormLabel><FormControl><Input placeholder="e.g., 85" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">12th Standard / Diploma (if applicable)</h3>
                     <div className="grid md:grid-cols-4 gap-6">
                         <FormField control={methods.control} name="stream12th" render={({ field }) => (
                            <FormItem><FormLabel>Stream</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Stream" /></SelectTrigger></FormControl><SelectContent><SelectItem value="pcm">Science (PCM)</SelectItem><SelectItem value="pcb">Science (PCB)</SelectItem><SelectItem value="commerce">Commerce</SelectItem><SelectItem value="arts">Arts/Humanities</SelectItem><SelectItem value="diploma">Diploma</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                         <FormField control={methods.control} name="board12th" render={({ field }) => (
                            <FormItem><FormLabel>Board</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger></FormControl><SelectContent><SelectItem value="cbse">CBSE</SelectItem><SelectItem value="icse">ICSE</SelectItem><SelectItem value="state">State Board</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                         <FormField control={methods.control} name="year12th" render={({ field }) => (
                            <FormItem><FormLabel>Year of Passing</FormLabel><FormControl><Input placeholder="e.g., 2022" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={methods.control} name="score12th" render={({ field }) => (
                            <FormItem><FormLabel>Overall Score (%)</FormLabel><FormControl><Input placeholder="e.g., 90" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Your Early Achievements (The "Spark" Finder)</h3>
                    <p className="text-sm text-muted-foreground mb-4">Think back to your school days. What were you known for? (e.g., Olympiads, Debate, Coding, Sports, Art, Leadership)</p>
                     <FormField control={methods.control} name="achievements" render={({ field }) => (
                        <FormItem><FormControl><Textarea placeholder="List a few of your passions or achievements..." {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>

            <div className={cn("space-y-6", step !== 2 && "hidden")}>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Subject-Level Deep Dive</h3>
                    <p className="text-sm text-muted-foreground mb-4">For each subject, tell us your score and how you *really* felt about it.</p>
                </div>
                 {subjects.map((subject) => {
                        const feeling = methods.watch(`subjects.${subject}.feeling`);
                        return (
                        <Card key={subject} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <FormLabel className="text-base font-semibold md:col-span-1">{subject}</FormLabel>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                    <FormField control={methods.control} name={`subjects.${subject}.score`} render={({ field }) => (
                                        <FormItem><FormLabel>Your Score (%)</FormLabel><FormControl><Input placeholder="e.g., 95" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={methods.control} name={`subjects.${subject}.feeling`} render={({ field }) => (
                                        <FormItem><FormLabel>Your Feeling</FormLabel><FormControl>
                                            <div className="flex items-center space-x-2 pt-2">
                                                <Button type="button" variant={feeling === 'loved' ? 'default' : 'outline'} size="icon" onClick={() => field.onChange('loved')}><Smile className="h-5 w-5" /></Button>
                                                <Button type="button" variant={feeling === 'okay' ? 'default' : 'outline'} size="icon" onClick={() => field.onChange('okay')}><Meh className="h-5 w-5" /></Button>
                                                <Button type="button" variant={feeling === 'disliked' ? 'default' : 'outline'} size="icon" onClick={() => field.onChange('disliked')}><Frown className="h-5 w-5" /></Button>
                                            </div></FormControl><FormMessage />
                                        </FormItem>
                                    )}/>
                                </div>
                            </div>
                        </Card>
                    )})}
            </div>

            <div className={cn("space-y-6", step !== 3 && "hidden")}>
                <div>
                    <h3 className="text-lg font-semibold mb-2">The Profile Scanner</h3>
                    <p className="text-sm text-muted-foreground mb-4">Let's calibrate your Compass. This isn't a test; it's a quick challenge to discover your hidden strengths.</p>
                </div>
                {QUIZ_QUESTIONS.map((q, index) => (
                    <FormField key={q.id} control={methods.control} name={`quizAnswers.${q.id}`} render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-base">{index+1}. {q.question}</FormLabel>
                            <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                {q.options.map((option, oIndex) => (
                                <FormItem key={oIndex} className="flex items-center space-x-3 space-y-0 p-3 rounded-md border has-[:checked]:bg-accent">
                                    <FormControl><RadioGroupItem value={option} id={`${q.id}-${oIndex}`} /></FormControl>
                                    <Label htmlFor={`${q.id}-${oIndex}`} className="font-normal flex-1 cursor-pointer">{option}</Label>
                                </FormItem>
                                ))}</RadioGroup></FormControl><FormMessage />
                        </FormItem>
                    )}/>
                ))}
            </div>

            <div className={cn("space-y-6", step !== 4 && "hidden")}>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Defining Your Direction</h3>
                    <p className="text-sm text-muted-foreground mb-4">Now that we understand your past and present, let's look to the future. What is your main goal right now?</p>
                </div>
                <FormField control={methods.control} name="goal" render={({ field }) => (
                    <FormItem className="space-y-4">
                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {GOAL_OPTIONS.map((option) => (
                                <FormItem key={option.id}>
                                    <FormControl><RadioGroupItem value={option.title} id={option.id} className="sr-only" /></FormControl>
                                    <Label htmlFor={option.id} className={cn("flex flex-col h-full items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", field.value === option.title ? "border-primary bg-accent" : "border-muted bg-popover")}>
                                        <h4 className="font-semibold mb-1">{option.title}</h4>
                                        <p className="text-sm text-muted-foreground text-center">{option.description}</p>
                                    </Label>
                                </FormItem>
                            ))}</RadioGroup></FormControl>
                        <div className="text-center"><FormMessage /></div>
                    </FormItem>
                )}/>
            </div>
          </div>

        <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 1 || loading}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
             {!isFinalStep ? (
                <Button type="button" onClick={handleNext} disabled={loading}>Next</Button>
            ) : (
                <Button type="submit" disabled={loading || !methods.watch('goal')}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finish
                </Button>
            )}
        </div>
      </form>
    </FormProvider>
  );
}
