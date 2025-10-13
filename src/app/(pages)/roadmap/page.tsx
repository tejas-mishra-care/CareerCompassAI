'use client';
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { RoadmapInputForm } from '@/components/roadmap/roadmap-input-form';
import { RoadmapDisplay, LoadingSpinner, WelcomeMessage, ErrorMessage } from '@/components/roadmap/roadmap-display';
import { generateLearningRoadmap, type GenerateLearningRoadmapInput, type GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';

export default function RoadmapPage() {
  const [formData, setFormData] = useState<GenerateLearningRoadmapInput>({
    name: 'Alex',
    subjects: 'React, TypeScript, Tailwind CSS',
    goal: 'Build a portfolio project in 4 weeks',
    timeAvailability: 'Weekdays 7-9 PM, Weekends 11 AM - 3 PM',
    learningStyle: 'Hands-on learner, prefers building projects over watching videos',
    weakAreas: 'State management in React',
  });

  const [roadmap, setRoadmap] = useState<GenerateLearningRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateRoadmapAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      const result = await generateLearningRoadmap(formData);
      setRoadmap(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while generating the roadmap.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight font-headline">
                    AI-Powered Learning Roadmap
                </h1>
                <p className="text-muted-foreground">
                    Generate a personalized study plan to achieve your goals efficiently.
                </p>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
             <RoadmapInputForm
              formData={formData}
              handleInputChange={handleInputChange}
              generateRoadmap={generateRoadmapAction}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : roadmap ? (
                <RoadmapDisplay roadmap={roadmap} name={formData.name} />
            ) : (
                <WelcomeMessage />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
