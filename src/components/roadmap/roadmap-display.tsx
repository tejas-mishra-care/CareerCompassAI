
'use client';
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bot, Loader2, AlertTriangle, Lightbulb, ExternalLink, RefreshCw, ClipboardCheck, CalendarDays, CalendarX, ChevronDown } from 'lucide-react';
import type { GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface RoadmapDisplayProps {
    roadmap: GenerateLearningRoadmapOutput;
    name: string;
    checkedState: Record<string, boolean>;
    onCheckedChange: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    onRegenerate: () => void;
    isRegenerating: boolean;
}

// Helper to get day of week index (0=Sunday, 1=Monday, ...)
const getDayIndex = (day: string) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days.indexOf(day.toLowerCase());
}

// New component for the stylized "road" segment
const RoadSegment = () => (
  <div
    aria-hidden="true"
    className="absolute left-[29px] top-14 h-[calc(100%_-_56px)] w-px -translate-x-px"
  >
    <div className="h-full w-full bg-gradient-to-b from-transparent via-border to-transparent" />
  </div>
);


const RoadmapInsightsCard = ({ roadmap, checkedState, onRegenerate, isRegenerating }: Omit<RoadmapDisplayProps, 'name' | 'onCheckedChange'>) => {
    const { totalTasks, completedTasks, chartData } = useMemo(() => {
        const week = roadmap.monthlyPlan.weeklyPlans[0];
        if (!week) return { totalTasks: 0, completedTasks: 0, chartData: [] };

        const total = week.dailySchedule.reduce((acc, day) => acc + day.sessions.length, 0);
        const completed = Object.values(checkedState).filter(Boolean).length;
        
        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const dailyData = daysOfWeek.map(dayAbbr => ({ name: dayAbbr, tasks: 0, completed: 0 }));

        week.dailySchedule.forEach(dayPlan => {
            const dayIndex = getDayIndex(dayPlan.day);
            if (dayIndex >= 1 && dayIndex <= 7) { // Monday to Sunday
                const dayKey = dayPlan.day.toLowerCase();
                dailyData[dayIndex - 1].tasks = dayPlan.sessions.length;
                dailyData[dayIndex - 1].completed = dayPlan.sessions.reduce((acc, session, sIndex) => {
                    return acc + (checkedState[`${dayKey}-${week.week}-${sIndex}`] ? 1 : 0);
                }, 0);
            }
        });
        
        return { totalTasks: total, completedTasks: completed, chartData: dailyData.filter(d => d.tasks > 0) };
    }, [roadmap, checkedState]);

    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <ClipboardCheck className="h-6 w-6 text-primary" />
                    Progress & Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="font-bold text-lg whitespace-nowrap">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        {completedTasks} of {totalTasks} tasks completed. Keep it up!
                    </p>
                </div>
                 <Separator />
                <div>
                    <h4 className="text-sm font-medium mb-2 text-center">Weekly Task Distribution</h4>
                     <ChartContainer config={{}} className="h-40 w-full">
                        <BarChart accessibilityLayer data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={25} />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value, name) => <>{`${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}`}</>} />} />
                          <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={4} name="Scheduled" />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                 <Separator />
                 <div className="text-center w-full pt-4">
                    <p className="text-sm font-semibold">Fallen Behind?</p>
                    <p className="text-xs text-muted-foreground mb-2">Let the AI generate a new catch-up plan.</p>
                    <Button onClick={onRegenerate} disabled={isRegenerating} className="w-full" size="sm">
                        {isRegenerating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Regenerate My Roadmap
                    </Button>
                 </div>
            </CardFooter>
        </Card>
    );
};

export const RoadmapDisplay = ({ roadmap, name, checkedState, onCheckedChange, onRegenerate, isRegenerating }: RoadmapDisplayProps) => {

  const handleCheckedChange = (taskId: string, checked: boolean) => {
    onCheckedChange(prev => ({ ...prev, [taskId]: checked }));
  };

  const todayIndex = new Date().getDay();

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{roadmap.roadmapTitle}</CardTitle>
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
        <div className="xl:col-span-3 space-y-4">
            {roadmap.monthlyPlan.weeklyPlans.map(weekPlan => {
                const activeDay = weekPlan.dailySchedule.findIndex(day => getDayIndex(day.day) === todayIndex);
                const defaultOpen = activeDay !== -1 ? `day-${activeDay}` : undefined;

                return (
                <Card key={weekPlan.week}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline">
                            <CalendarDays className="text-primary"/>
                            Week {weekPlan.week} Plan
                        </CardTitle>
                        <CardDescription>{weekPlan.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible defaultValue={defaultOpen} className="w-full">
                            <div className="relative pl-6">
                                {weekPlan.dailySchedule.map((dayPlan, dIndex) => {
                                    if(dayPlan.sessions.length === 0) return null;
                                    
                                    const dayIndex = getDayIndex(dayPlan.day);
                                    const isPast = dayIndex < todayIndex && dayIndex !== 0;
                                    const tasksForDay = dayPlan.sessions.length;
                                    const completedForDay = dayPlan.sessions.reduce((acc, session, sIndex) => {
                                        const taskId = `${dayPlan.day.toLowerCase()}-${weekPlan.week}-${sIndex}`;
                                        return acc + (checkedState[taskId] ? 1 : 0);
                                    }, 0);
                                    const isIncomplete = isPast && completedForDay < tasksForDay;

                                    return (
                                        <div key={dIndex} className="relative">
                                            {dIndex < weekPlan.dailySchedule.filter(d => d.sessions.length > 0).length - 1 && <RoadSegment />}
                                             <div className="absolute top-0 -left-[28px] h-14 w-14 rounded-full bg-background border-4 border-background flex items-center justify-center font-bold text-primary text-xs z-10">
                                                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs", 
                                                    dayIndex === todayIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                                                    completedForDay === tasksForDay && tasksForDay > 0 && "bg-green-500 text-white"
                                                    )}>
                                                    {dayPlan.day.substring(0,3)}
                                                </div>
                                            </div>
                                            <AccordionItem value={`day-${dIndex}`} className="border-b-0 pl-12 pb-8">
                                                <AccordionTrigger className="p-4 rounded-lg bg-muted/50 hover:bg-muted/80 data-[state=open]:rounded-b-none data-[state=open]:bg-muted">
                                                    <div className='flex justify-between items-center w-full pr-4'>
                                                        <h3 className="font-semibold text-lg">{dayPlan.day}</h3>
                                                        <div className="flex items-center gap-4">
                                                            {isIncomplete && (
                                                                <Badge variant="destructive" className="bg-amber-600">
                                                                    <CalendarX className="h-3 w-3 mr-1.5" />
                                                                    Incomplete
                                                                </Badge>
                                                            )}
                                                            <div className="text-sm font-mono text-muted-foreground">{completedForDay}/{tasksForDay} Done</div>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="p-0 border border-t-0 rounded-b-lg">
                                                    <div className="divide-y">
                                                        {dayPlan.sessions.map((session, sIndex) => {
                                                            const taskId = `${dayPlan.day.toLowerCase()}-${weekPlan.week}-${sIndex}`;
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
                                                                        <Label htmlFor={taskId} className="text-base font-semibold cursor-pointer">
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
                                                                        <p className="font-semibold text-primary text-xs whitespace-nowrap">{session.time}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )})}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </div>
                                    );
                                })}
                            </div>
                         </Accordion>
                    </CardContent>
                </Card>
            )})}
        </div>
        <div className="xl:col-span-1 sticky top-24 space-y-4">
           <RoadmapInsightsCard 
                roadmap={roadmap}
                checkedState={checkedState}
                onRegenerate={onRegenerate}
                isRegenerating={isRegenerating}
            />
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

    
