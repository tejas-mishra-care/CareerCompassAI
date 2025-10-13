
'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { exploreCareersWithChatbot } from '@/ai/flows/explore-careers-with-chatbot';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Wand2, PlusCircle, Lightbulb, Puzzle } from 'lucide-react';
import type { Pathway } from '@/lib/types';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface ParsedStep {
  title: string;
  description: string;
  skills?: string[];
  project?: string;
}

interface ParsedPathway {
  title: string;
  steps: ParsedStep[];
}

const parsePathway = (text: string): ParsedPathway | null => {
    try {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return null;

        const titleLine = lines.find(line => line.startsWith('#')) || `Learning Pathway`;
        const title = titleLine.replace(/#/g, '').replace('Learning Pathway for:', '').trim();

        const steps: ParsedStep[] = [];
        let currentStep: Partial<ParsedStep> = {};
        
        let stepContentAccumulator = '';

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (/^\d+\.\s/.test(trimmedLine)) {
                // When a new step starts, save the previous one if it exists
                if (currentStep.title) {
                    if (!currentStep.description) {
                      currentStep.description = stepContentAccumulator.trim();
                    }
                    steps.push(currentStep as ParsedStep);
                    stepContentAccumulator = '';
                }
                currentStep = { title: trimmedLine.replace(/^\d+\.\s/, '').replace(/\*\*/g, '').trim() };
            } else if (currentStep.title) {
                // This logic handles multi-line descriptions
                if (trimmedLine.toLowerCase().startsWith('description:')) {
                    currentStep.description = trimmedLine.substring(12).trim();
                } else if (trimmedLine.toLowerCase().startsWith('skills:')) {
                    currentStep.skills = trimmedLine.substring(7).trim().split(',').map(s => s.trim()).filter(Boolean);
                } else if (trimmedLine.toLowerCase().startsWith('project:')) {
                    currentStep.project = trimmedLine.substring(8).trim();
                } else {
                    // If it's not a keyed property, assume it's part of the description
                    if (!currentStep.description) {
                         stepContentAccumulator += (stepContentAccumulator ? ' ' : '') + trimmedLine;
                    }
                }
            }
        });
        
        // Add the last step
        if (currentStep.title) {
             if (!currentStep.description) {
                currentStep.description = stepContentAccumulator.trim();
            }
            steps.push(currentStep as ParsedStep);
        }

        // Fallback for simple numbered lists without keywords
        if (steps.every(s => !s.description && !s.skills && !s.project)) {
            const simpleSteps = lines
                .filter(line => /^\d+\.\s/.test(line.trim()))
                .map(line => ({
                    title: line.trim().replace(/^\d+\.\s/, '').replace(/\*\*/g, '').trim(),
                    description: "The AI will provide more details in a full implementation."
                }));
            if (simpleSteps.length > 0) {
                 return { title: `Learning Pathway for: ${title}`, steps: simpleSteps };
            }
        }


        if (steps.length === 0) return null;

        return { title: `Learning Pathway for: ${title}`, steps };
    } catch (error) {
        console.error("Failed to parse pathway:", error);
        return null;
    }
};



export function LearningPathwayGenerator() {
  const [topic, setTopic] = useState('');
  const [pathway, setPathway] = useState<ParsedPathway | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userProfile, setUserProfile } = useUserProfile();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setPathway(null);
    try {
      const prompt = `Generate a structured, 5-step learning plan for "${topic}".
      The overall title must start with "# Learning Pathway for: ${topic}".
      For each step, provide a clear title starting with a number and a period (e.g., "1. Master the Fundamentals"). After the title, on a new line, provide a one-sentence description for the step.`;

      const response = await exploreCareersWithChatbot({ question: prompt });
      const parsed = parsePathway(response.answer);
      
      if (parsed && parsed.steps.length > 0) {
        setPathway(parsed);
      } else {
         toast({
          variant: 'destructive',
          title: 'Parsing Error',
          description: "Could not structure the AI's response. Please try generating again.",
        });
      }
    } catch (error) {
      console.error('Failed to generate pathway:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate learning pathway.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartPathway = () => {
    if (!pathway || !userProfile) return;

    const newPathway: Pathway = {
      ...pathway,
      steps: pathway.steps.map(step => ({...step, completed: false}))
    };

    const updatedProfile = {
      ...userProfile,
      activePathways: [...(userProfile.activePathways || []), newPathway],
    };

    setUserProfile(updatedProfile);

    toast({
        title: "Pathway Started!",
        description: `You can now track your progress from the dashboard.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="e.g., 'Become a UX Designer' or 'Learn Python for data analysis'"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          className="text-base"
        />
        <Button onClick={handleGenerate} disabled={loading}>
          <Wand2 className="mr-2 h-4 w-4" /> Generate
        </Button>
      </div>

      {loading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start">
                        <div className="flex h-full items-center pr-4">
                            <div className="flex flex-col items-center">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-16 w-px mt-2" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2 pt-1">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      )}

      {pathway && (
        <Card className="animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle>
              <GraduationCap className="text-primary inline-block mr-3" /> {pathway.title.replace('Learning Pathway for: ', '')}
            </CardTitle>
            <CardDescription>
                Your AI-generated roadmap to success. Add this to your active pathways to start tracking your progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
             <div className="relative space-y-8">
              {pathway.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold z-10 bg-background",
                            "border-primary text-primary"
                        )}>
                            {index + 1}
                        </div>
                        {index < pathway.steps.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                    </div>
                    <div className="flex-1 space-y-2 pb-8">
                        <h3 className="font-bold text-lg -mt-1">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 justify-end">
                <Button onClick={handleStartPathway} disabled={!userProfile}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Start This Pathway
                </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
