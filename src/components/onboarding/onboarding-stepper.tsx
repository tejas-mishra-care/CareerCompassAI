
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Smile, Meh, Frown, ChevronLeft, PlusCircle, Trash2 } from 'lucide-react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Label } from '@/components/ui/label';

const subjectSchema = z.object({
    score: z.string().min(1, "Score is required.").max(3, "Invalid score."),
    feeling: z.enum(['loved', 'okay', 'disliked'], { required_error: "Please select a feeling."}),
});

const educationSchema = z.object({
    degree: z.string().min(1, "Degree is required."),
    fieldOfStudy: z.string().min(1, "Field of study is required."),
    university: z.string().min(1, "University is required."),
    year: z.string().min(4, "Please enter a valid year.").max(4),
    score: z.string().min(1, "Score is required."),
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

const onboardingSchema = z.object({
    board10th: z.string().min(1, "Please select your 10th standard board."),
    year10th: z.string().min(4, "Please enter a valid year.").max(4),
    score10th: z.string().min(1, "Please enter your score."),
    stream12th: z.string().optional(),
    board12th: z.string().optional(),
    year12th: z.string().optional(),
    score12th: z.string().optional(),
    higherEducation: z.array(educationSchema).optional(),
    achievements: z.string().optional(),
    subjects: z.record(subjectSchema),
    quizAnswers: z.record(z.string()),
    goal: z.string({ required_error: "Please select a goal to continue." }).min(1, "Please select a goal to continue."),
    timeAvailability: z.string({ required_error: "Please select your time availability." }).min(1, "Please select your time availability."),
  });

type OnboardingFormData = z.infer<typeof onboardingSchema>;

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
        higherEducation: [],
        achievements: '',
        subjects: defaultSubjects,
        quizAnswers: defaultQuizAnswers,
        goal: '',
        timeAvailability: '',
    };
  };

const HigherEducationFields = () => {
    const { control } = useFormContext<OnboardingFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "higherEducation",
    });

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-headline">Higher Education (if applicable)</h3>
            <div className="space-y-4">
                {fields.map((item, index) => (
                    <Card key={item.id} className="p-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <FormField control={control} name={`higherEducation.${index}.degree`} render={({ field }) => (
                                <FormItem><FormLabel>Degree</FormLabel><FormControl><Input placeholder="e.g., Bachelor of Technology" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={control} name={`higherEducation.${index}.fieldOfStudy`} render={({ field }) => (
                                <FormItem><FormLabel>Field of Study</FormLabel><FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={control} name={`higherEducation.${index}.university`} render={({ field }) => (
                                <FormItem><FormLabel>University/College</FormLabel><FormControl><Input placeholder="e.g., MIT" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={control} name={`higherEducation.${index}.year`} render={({ field }) => (
                                <FormItem><FormLabel>Year of Passing</FormLabel><FormControl><Input placeholder="e.g., 2026" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={control} name={`higherEducation.${index}.score`} render={({ field }) => (
                                <FormItem><FormLabel>Overall Score (CGPA/%)</FormLabel><FormControl><Input placeholder="e.g., 8.5 or 85%" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </Card>
                ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ degree: '', fieldOfStudy: '', university: '', year: '', score: '' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Degree
            </Button>
        </div>
    );
}

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
  
  const { trigger, getValues } = methods;

  const watchedStream = methods.watch('stream12th') || 'default';
  const subjects = useMemo(() => STREAM_SUBJECTS[watchedStream] || STREAM_SUBJECTS.default, [watchedStream]);

  React.useEffect(() => {
    const currentSubjects = getValues('subjects');
    const newSubjects = subjects.reduce((acc, subject) => {
        acc[subject] = currentSubjects[subject] || { score: '', feeling: undefined as any };
        return acc;
    }, {} as any);
    methods.setValue('subjects', newSubjects);
  }, [watchedStream, subjects, methods, getValues]);


  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingFormData | `subjects.${string}` | `quizAnswers.${string}`)[] = [];
    
    if (step === 1) fieldsToValidate = ['board10th', 'year10th', 'score10th'];
    if (step === 2) {
       fieldsToValidate = subjects.map(s => `subjects.${s}`);
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
    console.log("--- Step 1: handleFinish function triggered ---");
    console.log("--- Step 2: Aggregated Onboarding Data ---", data);

    if (!userProfile) {
        toast({ variant: 'destructive', title: 'Error', description: 'User profile not found. Please try logging in again.' });
        return;
    }
    setLoading(true);
    try {
        console.log("--- Step 3: Attempting to save to Firestore... ---");
        await setUserProfile({
            ...userProfile,
            onboardingData: data,
            onboardingCompleted: true,
            // Promote key fields for querying
            stream12th: data.stream12th,
            goal: data.goal,
            timeAvailability: data.timeAvailability,
        });

        console.log("--- Step 4: SUCCESS! Data saved to Firestore. ---");
        toast({
            title: "Progress Saved!",
            description: "Redirecting to your dashboard to build your profile.",
        });

      router.push('/dashboard');

    } catch (error) {
      console.error("--- Step 4: FAILED! Error saving to Firestore: ---", error);
      toast({ variant: 'destructive', title: 'Error Saving Progress', description: 'Could not save your progress. Please check your connection and try again.' });
      setLoading(false);
    }
  };
  
  const totalSteps = 4;
  const isFinalStep = step === totalSteps;
  const isGoalSelected = !!methods.watch('goal') && !!methods.watch('timeAvailability');

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFinish)} className="py-4 space-y-8">
        <Progress value={(step / totalSteps) * 100} className="w-full mb-8" />
        
          <div className="min-h-[450px] relative">
            <div className={cn("space-y-8 transition-opacity duration-300", step === 1 ? "opacity-100" : "opacity-0 absolute inset-0 -z-10")}>
                 <div>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-headline">10th Standard Details</h3>
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
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-headline">12th Standard / Diploma (if applicable)</h3>
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
                <HigherEducationFields />
                 <div>
                    <h3 className="text-lg font-semibold mb-2 font-headline">Your Early Achievements (The "Spark" Finder)</h3>
                    <p className="text-sm text-muted-foreground mb-4">Think back to your school days. What were you known for? (e.g., Olympiads, Debate, Coding, Sports, Art, Leadership)</p>
                     <FormField control={methods.control} name="achievements" render={({ field }) => (
                        <FormItem><FormControl><Textarea placeholder="List a few of your passions or achievements..." {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            </div>

            <div className={cn("space-y-6 transition-opacity duration-300", step === 2 ? "opacity-100" : "opacity-0 absolute inset-0 -z-10")}>
                 <div>
                    <h3 className="text-lg font-semibold mb-2 font-headline">Subject-Level Deep Dive</h3>
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

            <div className={cn("space-y-6 transition-opacity duration-300", step === 3 ? "opacity-100" : "opacity-0 absolute inset-0 -z-10")}>
                <div>
                    <h3 className="text-lg font-semibold mb-2 font-headline">The Profile Scanner</h3>
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

            <div className={cn("space-y-6 transition-opacity duration-300", step === 4 ? "opacity-100" : "opacity-0 absolute inset-0 -z-10")}>
                 <div>
                    <h3 className="text-lg font-semibold mb-2 font-headline">Defining Your Direction</h3>
                    <p className="text-sm text-muted-foreground mb-4">Now that we understand your past and present, let's look to the future. What is your main goal right now?</p>
                </div>
                <FormField control={methods.control} name="goal" render={({ field }) => (
                    <FormItem className="space-y-4">
                        <FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {GOAL_OPTIONS.map((option) => (
                                <FormItem key={option.id}>
                                    <FormControl><RadioGroupItem value={option.title} id={option.id} className="sr-only" /></FormControl>
                                    <Label htmlFor={option.id} className={cn("flex flex-col h-full items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", field.value === option.title ? "border-primary bg-accent" : "border-muted bg-popover")}>
                                        <h4 className="font-semibold mb-1 font-headline">{option.title}</h4>
                                        <p className="text-sm text-muted-foreground text-center">{option.description}</p>
                                    </Label>
                                </FormItem>
                            ))}</RadioGroup></FormControl>
                        <div className="text-center"><FormMessage /></div>
                    </FormItem>
                )}/>
                <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2 font-headline">Weekly Commitment</h3>
                    <p className="text-sm text-muted-foreground mb-4">How much time can you dedicate to learning each week?</p>
                    <FormField control={methods.control} name="timeAvailability" render={({ field }) => (
                        <FormItem><FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full md:w-1/2 mx-auto">
                                    <SelectValue placeholder="Select your weekly availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2-4 hours">Casual (2-4 hours / week)</SelectItem>
                                    <SelectItem value="5-7 hours">Moderate (5-7 hours / week)</SelectItem>
                                    <SelectItem value="8-10 hours">Serious (8-10 hours / week)</SelectItem>
                                    <SelectItem value="10+ hours">Intense (10+ hours / week)</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl><div className="text-center pt-2"><FormMessage /></div></FormItem>
                    )}/>
                </div>
            </div>
          </div>

        <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 1 || loading}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
             {!isFinalStep ? (
                <Button type="button" onClick={handleNext} disabled={loading}>Next</Button>
            ) : (
                <Button type="submit" disabled={loading || !isGoalSelected}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finish & Build Profile
                </Button>
            )}
        </div>
      </form>
    </FormProvider>
  );
}
// Updated
