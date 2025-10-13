
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { GraduationCap, CalendarClock, Wand2, Loader2 } from 'lucide-react';
import type { Pathway } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { generateTimetable, type GenerateTimetableOutput } from '@/ai/flows/generate-timetable-from-pathway';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const TimetableDisplay = ({ timetable }: { timetable: GenerateTimetableOutput }) => {
  return (
    <Card className="mt-6 bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CalendarClock className="text-primary h-6 w-6" />
          Your Generated Weekly Timetable
        </CardTitle>
        <CardDescription>{timetable.reasoning}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timetable.weeklyTimetable.map((day) => (
            <div key={day.day} className="p-4 border rounded-lg bg-background">
              <h4 className="font-bold text-lg border-b pb-2 mb-2">{day.day}</h4>
              <ul className="space-y-2">
                {day.tasks.map((task, index) => (
                  <li key={index} className="text-sm flex justify-between items-center">
                    <span className={task.isBreak ? "text-muted-foreground italic" : ""}>{task.task}</span>
                    <span className="font-semibold text-muted-foreground whitespace-nowrap text-xs">{task.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PathwayDetailPage({ params }: { params: { pathwayId: string } }) {
  const { userProfile, setUserProfile, loading } = useUserProfile();
  const [isGeneratingTimetable, setIsGeneratingTimetable] = useState(false);
  const [timetable, setTimetable] = useState<GenerateTimetableOutput | null>(null);
  const { toast } = useToast();

  const pathway = userProfile?.activePathways?.find(p => slugify(p.title) === params.pathwayId);

  const handleStepToggle = (pathwayTitle: string, stepIndex: number, completed: boolean) => {
    if (!userProfile?.activePathways || !userProfile.skills) return;

    // --- Start of SP Awarding Logic ---
    const SKILL_POINTS_AWARDED = 10;
    
    // Simulate awarding SP to the first 2 skills for demonstration.
    // A real implementation would have skills associated with each step.
    const newSkills = [...userProfile.skills].map((skill, index) => {
        if (index < 2) { // Award points to the first two skills
            const newProficiency = completed
                ? Math.min(100, skill.proficiency + SKILL_POINTS_AWARDED)
                : Math.max(0, skill.proficiency - SKILL_POINTS_AWARDED);
            return { ...skill, proficiency: newProficiency };
        }
        return skill;
    });
    // --- End of SP Awarding Logic ---


    const newPathways = userProfile.activePathways.map(p => {
      if (p.title === pathwayTitle) {
        const newSteps = [...p.steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], completed };
        return { ...p, steps: newSteps };
      }
      return p;
    });

    setUserProfile({ ...userProfile, activePathways: newPathways, skills: newSkills });
  };
  
  const handleGenerateTimetable = async () => {
    if (!pathway || !userProfile?.timeAvailability) {
        toast({ variant: 'destructive', title: 'Missing Information', description: 'Please ensure you have set your weekly time availability in your profile.' });
        return;
    }
    setIsGeneratingTimetable(true);
    setTimetable(null);
    try {
        const profileString = `Skills: ${userProfile.skills.map(s => `${s.name} (Proficiency: ${s.proficiency})`).join(', ')}. Goal: ${userProfile.goal}`;
        const result = await generateTimetable({
            pathwayTitle: pathway.title,
            pathwaySteps: pathway.steps.map(s => `Title: ${s.title}, Description: ${s.description}`),
            timeAvailability: userProfile.timeAvailability,
            userProfile: profileString,
        });
        setTimetable(result);
        toast({ title: 'Timetable Generated!', description: 'Your personalized weekly schedule is ready.' });
    } catch (error) {
        console.error("Failed to generate timetable", error);
        toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate a timetable at this time.' });
    } finally {
        setIsGeneratingTimetable(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Skeleton className="h-10 w-3/4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-6 w-6 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (!pathway) {
    notFound();
  }

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          My Learning Pathway
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>
              <GraduationCap className="text-primary h-6 w-6 inline-block mr-3" /> {pathway.title.replace('Learning Pathway for: ', '')}
            </CardTitle>
            <CardDescription>
              Check off the steps as you complete them to track your progress and earn Skill Points (SP)!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            {pathway.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border has-[:checked]:bg-secondary/50">
                <Checkbox
                  id={`step-${index}`}
                  checked={step.completed}
                  onCheckedChange={(checked) => {
                    handleStepToggle(pathway.title, index, !!checked);
                  }}
                  className="h-6 w-6 mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={`step-${index}`} className="text-lg font-semibold cursor-pointer">
                    {step.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <Separator />
           <CardFooter className="flex-col items-start gap-4 p-6">
                <div>
                    <h3 className="text-lg font-semibold font-headline">Generate a Personalized Schedule</h3>
                    <p className="text-sm text-muted-foreground">
                        Use our AI to create a weekly timetable based on this pathway and your available time ({userProfile?.timeAvailability || 'N/A'}).
                    </p>
                </div>
                <Button onClick={handleGenerateTimetable} disabled={isGeneratingTimetable}>
                    {isGeneratingTimetable ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate Timetable
                </Button>
            </CardFooter>
        </Card>
        
        {isGeneratingTimetable && (
          <Card className="mt-6">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="font-semibold">Our AI is building your schedule...</p>
              <p className="text-sm text-muted-foreground">This might take a moment.</p>
            </CardContent>
          </Card>
        )}

        {timetable && <TimetableDisplay timetable={timetable} />}
      </div>
    </AppShell>
  );
}
