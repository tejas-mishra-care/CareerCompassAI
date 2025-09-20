
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import type { UserProfile, Skill } from '@/lib/types';
import { getOnboardingQuestion, OnboardingQuestionOutput } from '@/ai/flows/onboarding-flow';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const TOPICS = ['Interests', 'Skills', 'Goals'];
const QUESTIONS_PER_TOPIC = 2;

interface Answer {
  question: string;
  answer: string;
}

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <Skeleton className="h-6 w-3/4" />
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export function OnboardingStepper({ onFinish }: { onFinish: () => void }) {
  const { user, userProfile, setUserProfile } = useUserProfile();
  const { toast } = useToast();
  
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<OnboardingQuestionOutput | null>(null);
  const [loading, setLoading] = useState(true);
  
  const currentTopic = TOPICS[Math.floor(step / QUESTIONS_PER_TOPIC)];

  useEffect(() => {
    const fetchQuestion = async () => {
      if (step >= TOPICS.length * QUESTIONS_PER_TOPIC) return;
      setLoading(true);
      try {
        const res = await getOnboardingQuestion({
          previousAnswers: answers,
          currentTopic: currentTopic,
        });
        setCurrentQuestion(res);
      } catch(error) {
        console.error("Failed to get onboarding question", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load the next question. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [step, answers, currentTopic, toast]);

  const handleNext = () => {
    if (!currentQuestion || !currentAnswer.trim()) return;
    
    setAnswers([...answers, { question: currentQuestion.question, answer: currentAnswer }]);
    setCurrentAnswer('');
    setStep(step + 1);
  };

  const handleFinish = () => {
    if (!userProfile) return;

    // A more sophisticated implementation would use AI to extract skills and interests.
    // For now, we'll create a basic profile.
    const finalProfile: UserProfile = {
      ...userProfile,
      name: user?.displayName || userProfile.name, // Use display name from auth
      bio: answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n'),
      // In a real scenario, an AI flow would parse `answers` to populate skills
      skills: [
        { name: "Problem Solving", proficiency: 30 },
        { name: "Creativity", proficiency: 25 },
        { name: "Communication", proficiency: 20 },
      ], 
    };

    setUserProfile(finalProfile);
    onFinish();
  };
  
  const isFinalStep = step >= TOPICS.length * QUESTIONS_PER_TOPIC -1;

  return (
    <div className="py-4 space-y-6 min-h-[300px]">
        {loading ? <LoadingSkeleton /> : currentQuestion && (
             <div className="space-y-4">
                <Label className="text-lg font-semibold">{currentQuestion.question}</Label>
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                    <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
                        {currentQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 rounded-md border has-[:checked]:bg-accent">
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                ) : (
                    <Input 
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    />
                )}
             </div>
        )}
      
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {TOPICS.length * QUESTIONS_PER_TOPIC}
        </p>
        <Button onClick={isFinalStep ? handleFinish : handleNext} disabled={loading || !currentAnswer.trim()}>
          {isFinalStep ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
