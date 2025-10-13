'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { RoadmapInputForm } from '@/components/roadmap/roadmap-input-form';
import { RoadmapDisplay, WelcomeMessage, LoadingSpinner, ErrorMessage } from '@/components/roadmap/roadmap-display';
import { generateLearningRoadmap, type GenerateLearningRoadmapInput, type GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import { useToast } from '@/hooks/use-toast';

export default function RoadmapPage() {
  const [formData, setFormData] = useState<GenerateLearningRoadmapInput>({
    name: '',
    subjects: '',
    goal: '',
    timeAvailability: '',
    learningStyle: '',
    weakAreas: '',
  });
  const [roadmap, setRoadmap] = useState<GenerateLearningRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, subjects, goal, timeAvailability, learningStyle } = formData;
    if (!name || !subjects || !goal || !timeAvailability || !learningStyle) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
      });
      return false;
    }
    return true;
  };

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setRoadmap(null);
    setError('');

    try {
      const result = await generateLearningRoadmap(formData);
      setRoadmap(result);
      toast({
        title: 'Roadmap Generated!',
        description: 'Your personalized learning plan is ready.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error("Roadmap generation failed:", err);
      setError(`An error occurred while generating the roadmap. Details: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    AI Learning Roadmap Generator
                </h1>
            </div>
            <p className="text-muted-foreground">
                Enter your details to create a personalized, AI-powered study plan for the week.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 xl:col-span-3">
                    <RoadmapInputForm
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={handleInputChange}
                    generateRoadmap={handleGenerateRoadmap}
                    isLoading={isLoading}
                    />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorMessage message={error} />}
                    {roadmap ? (
                    <RoadmapDisplay roadmap={roadmap} name={formData.name} />
                    ) : (
                    !isLoading && <WelcomeMessage />
                    )}
                </div>
            </div>
        </div>
    </AppShell>
  );
}
