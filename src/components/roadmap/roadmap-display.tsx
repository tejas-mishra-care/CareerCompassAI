'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader2, AlertTriangle, Lightbulb, User } from 'lucide-react';
import type { GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';

// Component to Display the Generated Roadmap
export const RoadmapDisplay = ({ roadmap, name }: { roadmap: GenerateLearningRoadmapOutput, name: string }) => (
  <Card className="animate-in fade-in duration-500">
    <CardHeader>
      <CardTitle className="text-3xl">{roadmap.roadmapTitle}</CardTitle>
      <CardDescription className="text-base pt-2">
        {roadmap.introduction.replace('{name}', name)}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-8">
       <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" /> The 'Why' Behind Your Plan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-secondary-foreground">{roadmap.reasoning}</p>
            </CardContent>
       </Card>

      <div className="space-y-8">
        {roadmap.weeklySchedule.map((dayPlan, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted/50 border-b">
                <h3 className="text-xl font-bold font-headline">
                    {dayPlan.day}
                </h3>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {dayPlan.sessions.length > 0 ? (
                        dayPlan.sessions.map((session, sIndex) => (
                            <div key={sIndex} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-muted/50 transition-colors">
                                <div className="md:col-span-2">
                                    <p className="font-semibold text-primary">{session.time}</p>
                                </div>
                                <div className="md:col-span-3">
                                    <p className="font-bold">{session.subject}</p>
                                    <p className="text-sm text-muted-foreground">{session.topic}</p>
                                </div>
                                <div className="md:col-span-3">
                                    <p>{session.activity}</p>
                                </div>
                                <div className="md:col-span-4 text-sm text-muted-foreground bg-secondary p-2 rounded-md">
                                    <p><span className="font-semibold">Justification:</span> {session.justification}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-muted-foreground italic">No sessions scheduled. Enjoy your break!</div>
                    )}
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);


// Welcome Message Component
export const WelcomeMessage = () => (
  <Card className="flex flex-col items-center justify-center text-center h-full min-h-[400px]">
    <CardContent className="p-8">
        <Bot className="h-16 w-16 text-primary/70 mx-auto mb-4" />
        <h2 className="text-2xl font-bold font-headline mb-2">Welcome to Your Personal Learning Assistant!</h2>
        <p className="max-w-md text-muted-foreground">
        Ready to conquer your goals? Just fill in your details on the left, and I'll create a smart, personalized study plan designed just for you.
        </p>
    </CardContent>
  </Card>
);

// Loading Spinner Component
export const LoadingSpinner = () => (
  <Card className="flex flex-col items-center justify-center text-center h-full min-h-[400px]">
     <CardContent className="p-8">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Crafting Your Roadmap...</h2>
        <p className="text-muted-foreground">The AI is analyzing your inputs to build the perfect plan.</p>
    </CardContent>
  </Card>
);

// Error Message Component
export const ErrorMessage = ({ message }: { message: string }) => (
    <Card className="flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-destructive/10 border-destructive">
         <CardContent className="p-8">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-destructive-foreground">Oops! Something went wrong.</h2>
            <p className="text-destructive-foreground/80 max-w-md">{message}</p>
        </CardContent>
    </Card>
);
