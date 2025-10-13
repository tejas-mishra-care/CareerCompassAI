'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bot, Loader2, AlertTriangle, Lightbulb, ExternalLink, Activity } from 'lucide-react';
import type { GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const WeeklyProgress = ({ roadmap }: { roadmap: GenerateLearningRoadmapOutput }) => {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const totalTasks = useMemo(() => {
    return roadmap.weeklySchedule.reduce((acc, day) => acc + day.sessions.length, 0);
  }, [roadmap]);

  const completedTasks = useMemo(() => {
    return Object.values(checkedState).filter(Boolean).length;
  }, [checkedState]);

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Progress value={progressPercentage} className="h-3" />
          <span className="font-bold text-lg whitespace-nowrap">{Math.round(progressPercentage)}%</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {completedTasks} of {totalTasks} tasks completed this week. Keep it up!
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex-grow">
          {roadmap.weeklySchedule.map(dayPlan => {
            const dayId = dayPlan.day.toLowerCase();
            const tasksForDay = dayPlan.sessions.length;
            if (tasksForDay === 0) return null;
            
            const completedForDay = dayPlan.sessions.reduce((acc, session, sIndex) => {
              const taskId = `${dayId}-${sIndex}`;
              return acc + (checkedState[taskId] ? 1 : 0);
            }, 0);

            return (
              <div key={dayId} className="flex items-center justify-between text-xs my-1">
                <span className="font-semibold">{dayPlan.day}</span>
                <span className="text-muted-foreground">{completedForDay} / {tasksForDay}</span>
              </div>
            )
          })}
        </div>
      </CardFooter>
    </Card>
  );
};


export const RoadmapDisplay = ({ roadmap, name }: { roadmap: GenerateLearningRoadmapOutput, name: string }) => {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const handleCheckedChange = (taskId: string, checked: boolean) => {
    setCheckedState(prev => ({ ...prev, [taskId]: checked }));
  };

  const totalTasks = useMemo(() => {
    return roadmap.weeklySchedule.reduce((acc, day) => acc + day.sessions.length, 0);
  }, [roadmap]);

  const completedTasks = useMemo(() => {
    return Object.values(checkedState).filter(Boolean).length;
  }, [checkedState]);

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;


  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{roadmap.roadmapTitle}</CardTitle>
          <CardDescription className="text-base pt-2">
            {roadmap.introduction.replace('{name}', name)}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Card className="bg-secondary/50 border-dashed">
              <CardHeader className="flex-row items-start gap-4">
                  <Lightbulb className="h-8 w-8 text-primary/80 mt-1" />
                  <div>
                      <h3 className="text-xl font-bold font-headline">The 'Why' Behind Your Plan</h3>
                      <p className="text-secondary-foreground">{roadmap.reasoning}</p>
                  </div>
              </CardHeader>
            </Card>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="xl:col-span-3 space-y-6">
            {roadmap.weeklySchedule.map((dayPlan, dIndex) => {
                if(dayPlan.sessions.length === 0) return null;
                return (
                <Card key={dIndex} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b">
                        <h3 className="text-xl font-bold font-headline">
                            {dayPlan.day}
                        </h3>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {dayPlan.sessions.map((session, sIndex) => {
                                const taskId = `${dayPlan.day.toLowerCase()}-${sIndex}`;
                                return (
                                <div key={sIndex} className={cn("p-4 items-start transition-colors", checkedState[taskId] ? "bg-green-950/50" : "hover:bg-muted/50")}>
                                    <div className="flex items-start gap-4">
                                        <Checkbox
                                            id={taskId}
                                            checked={checkedState[taskId]}
                                            onCheckedChange={(checked) => handleCheckedChange(taskId, !!checked)}
                                            className="h-5 w-5 mt-1 shrink-0"
                                        />
                                        <div className="flex-1 grid gap-1">
                                            <Label htmlFor={taskId} className="text-lg font-semibold cursor-pointer">
                                                {session.subject}: <span className="font-normal">{session.topic}</span>
                                            </Label>
                                            <p className="text-sm text-muted-foreground">{session.activity}</p>
                                            {session.resources && session.resources.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {session.resources.map(res => (
                                                        <Badge variant="secondary" key={res}>
                                                          <ExternalLink className="h-3 w-3 mr-1.5" /> {res}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-primary text-sm whitespace-nowrap">{session.time}</p>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </CardContent>
                </Card>
            )})}
        </div>
        <div className="xl:col-span-1 sticky top-8">
           <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={progressPercentage} className="h-3" />
                  <span className="font-bold text-lg whitespace-nowrap">{Math.round(progressPercentage)}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {completedTasks} of {totalTasks} tasks completed. Keep it up!
                </p>
                 <Separator className="my-4" />
                 <div className="space-y-2">
                  {roadmap.weeklySchedule.map(dayPlan => {
                    const tasksForDay = dayPlan.sessions.length;
                    if (tasksForDay === 0) return null;
                    
                    const completedForDay = dayPlan.sessions.reduce((acc, session, sIndex) => {
                      const taskId = `${dayPlan.day.toLowerCase()}-${sIndex}`;
                      return acc + (checkedState[taskId] ? 1 : 0);
                    }, 0);

                    return (
                      <div key={dayPlan.day} className="flex items-center justify-between text-xs">
                        <span className="font-semibold">{dayPlan.day}</span>
                        <span className="text-muted-foreground font-mono">{completedForDay} / {tasksForDay}</span>
                      </div>
                    )
                  })}
                 </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}


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
