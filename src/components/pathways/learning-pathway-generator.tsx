
'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { exploreCareersWithChatbot } from '@/ai/flows/explore-careers-with-chatbot';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Wand2, PlusCircle } from 'lucide-react';
import type { Pathway } from '@/lib/types';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';

interface ParsedPathway {
  title: string;
  steps: { title: string; description: string; }[];
}

// More robust parser to handle markdown lists and bold titles
const parsePathway = (text: string): ParsedPathway | null => {
    try {
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return null;
  
      const titleLine = lines.find(line => line.startsWith('#') || line.toLowerCase().includes('pathway for:')) || `Learning Pathway`;
      const title = titleLine.replace(/#|\*/g, '').replace('Learning Pathway for:', '').trim();

      const steps: { title: string; description: string; }[] = [];
      let currentStep: { title: string; description: string; } | null = null;
  
      lines.forEach(line => {
        const trimmedLine = line.trim();
        const isStepTitle = /^\d+\.\s/.test(trimmedLine) || /^\*\s/.test(trimmedLine) || /^\-\s/.test(trimmedLine);
  
        if (isStepTitle) {
          if (currentStep) steps.push(currentStep);
          // Extract title from formats like "1. **Title:** Description" or "1. Title"
          const titleMatch = trimmedLine.match(/^\d+\.\s+\**(.+?)\**(\s*:\s*(.*))?$/);
          if (titleMatch) {
            currentStep = {
              title: titleMatch[1].trim(),
              description: titleMatch[3] ? titleMatch[3].trim() : ''
            };
          } else {
             currentStep = { title: trimmedLine.replace(/^\d+\.\s*|^\*\s*|^\-\s*/, '').replace(/\*\*$/, '').trim(), description: '' };
          }
        } else if (currentStep && !currentStep.description) {
            // Assign the first non-title line as the description
            currentStep.description = trimmedLine;
        } else if (currentStep) {
            // Append to existing description if needed (though we aim for 1-sentence descriptions)
        }
      });
  
      if (currentStep) steps.push(currentStep);
      
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
      const prompt = `Generate a structured, step-by-step learning plan for "${topic}".
      The overall title should be "Learning Pathway for: ${topic}".
      Provide exactly 5 numbered steps.
      For each step, provide a clear title and a concise one-sentence description.
      Format each step like this: "1. **Step Title:** Step description."`;

      const response = await exploreCareersWithChatbot({ question: prompt });
      const parsed = parsePathway(response.answer);

      if (parsed && parsed.steps.length > 0) {
        setPathway(parsed);
      } else {
        setPathway({ title: `Learning Pathway for: ${topic}`, steps: [{ title: 'Review the generated plan', description: response.answer }] });
        toast({
          variant: 'default',
          title: 'Displaying Raw Plan',
          description: 'Could not structure the AI response as a checklist, showing the raw plan.',
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
        description: `You've started the "${pathway.title}" pathway.`,
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
        <Card className="shadow-md">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start">
                        <div className="flex h-full items-center pr-4">
                            <div className="flex flex-col items-center">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-10 w-px mt-2" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2 pt-1">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      )}

      {pathway && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-3">
              <GraduationCap className="text-primary" /> {pathway.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="relative space-y-2">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" aria-hidden="true" />
              {pathway.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold z-10">
                        {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="font-semibold text-lg">{step.title}</p>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 justify-end">
                <Button onClick={handleStartPathway} disabled={!userProfile}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Start Pathway
                </Button>          </CardFooter>
        </Card>
      )}
    </div>
  );
}
