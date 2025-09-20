'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { exploreCareersWithChatbot } from '@/ai/flows/explore-careers-with-chatbot';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Wand2, ArrowRight } from 'lucide-react';
import { Separator } from '../ui/separator';

interface PathwayStep {
  title: string;
  description: string;
}

interface Pathway {
  title: string;
  steps: PathwayStep[];
}

// Simple parser to handle potential markdown in AI response
const parsePathway = (text: string): Pathway | null => {
  try {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const title = lines[0].replace(/#|\*/g, '').trim();
    const steps: PathwayStep[] = [];
    let currentStep: PathwayStep | null = null;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('*') || /^\d+\./.test(line)) {
            if (currentStep) {
                steps.push(currentStep);
            }
            currentStep = { title: line.replace(/#|\*|^\d+\./g, '').trim(), description: '' };
        } else if (currentStep && line) {
            currentStep.description = (currentStep.description ? currentStep.description + ' ' : '') + line;
        }
    }
    if (currentStep) {
        steps.push(currentStep);
    }
    
    if (steps.length === 0) return null;

    return { title, steps };
  } catch (error) {
    console.error("Failed to parse pathway:", error);
    return null;
  }
};

export function LearningPathwayGenerator() {
  const [topic, setTopic] = useState('');
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setPathway(null);
    try {
      const prompt = `Generate a structured, step-by-step learning plan for "${topic}".
      Start with a title like "Learning Pathway for: ${topic}".
      Then, list at least 5 numbered or bulleted steps. For each step, provide a clear title and a brief one-sentence description of what to do.`;

      const response = await exploreCareersWithChatbot({ question: prompt });
      const parsed = parsePathway(response.answer);

      if (parsed) {
        setPathway(parsed);
      } else {
        // Fallback for unparseable response
        setPathway({ title: `Learning Pathway for: ${topic}`, steps: [{ title: 'Review the plan', description: response.answer }] });
        toast({
          variant: 'default',
          title: 'Displaying Raw Plan',
          description: 'Could not structure the AI response, showing the raw plan.',
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
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                        <Skeleton className="h-5 w-5 rounded-sm" />
                        <div className="space-y-2">
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
          <CardContent>
            <div className="space-y-6">
              {pathway.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                    <div className="flex h-full items-center pr-4">
                        <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                {index + 1}
                            </div>
                            {index < pathway.steps.length - 1 && <div className="h-10 w-px bg-border mt-2"></div>}
                        </div>
                    </div>
                    <div className="flex-1 pb-10 border-l pl-4 -ml-px">
                        <p className="font-semibold text-lg">{step.title}</p>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
