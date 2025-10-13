
'use client';
import React, { useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { RoadmapInputForm } from '@/components/roadmap/roadmap-input-form';
import { RoadmapDisplay, LoadingSpinner, WelcomeMessage, ErrorMessage } from '@/components/roadmap/roadmap-display';
import { generateLearningRoadmap, type GenerateLearningRoadmapInput, type GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import dynamic from 'next/dynamic';
import { AppShellSkeleton } from '@/components/layout/app-shell-skeleton';

const RoadmapPageContent = () => {
  const [formData, setFormData] = useState<GenerateLearningRoadmapInput>({
    name: '',
    subjects: '',
    goal: '',
    timeAvailability: '',
    learningStyle: '',
    weakAreas: '',
    completedTasks: '',
  });

  const [roadmap, setRoadmap] = useState<GenerateLearningRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateRoadmapAction = useCallback(async (isRegeneration = false) => {
    setIsLoading(true);
    setError(null);
    if (!isRegeneration) {
        setRoadmap(null);
        setCheckedState({});
    }

    try {
        let completedTasksSummary = '';
        if (isRegeneration && roadmap) {
            completedTasksSummary = roadmap.monthlyPlan.weeklyPlans.flatMap(week =>
                week.dailySchedule.flatMap(day =>
                    day.sessions
                        .filter((session, sIndex) => checkedState[`${day.day.toLowerCase()}-${week.week}-${sIndex}`])
                        .map(session => `${session.subject}: ${session.topic}`)
                )
            ).join(', ');
        }
        
      const result = await generateLearningRoadmap({
          ...formData,
          completedTasks: completedTasksSummary || undefined
      });
      setRoadmap(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while generating the roadmap.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, roadmap, checkedState]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateRoadmapAction(false);
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
              generateRoadmap={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            {isLoading && !roadmap ? ( // Show main loading spinner only on initial generation
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : roadmap ? (
                <RoadmapDisplay 
                    roadmap={roadmap} 
                    name={formData.name}
                    checkedState={checkedState}
                    onCheckedChange={setCheckedState}
                    onRegenerate={() => generateRoadmapAction(true)}
                    isRegenerating={isLoading && !!roadmap} // Pass regenerating state
                />
            ) : (
                <WelcomeMessage />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const DynamicRoadmapPage = dynamic(() => Promise.resolve(RoadmapPageContent), {
    ssr: false,
    loading: () => <AppShellSkeleton />,
});

export default function RoadmapPage() {
    return <DynamicRoadmapPage />;
}

    