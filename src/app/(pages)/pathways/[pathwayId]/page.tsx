'use client';
import { AppShell } from '@/components/layout/app-shell';
import { useUserProfile } from '@/hooks/use-user-profile';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';
import type { Pathway } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function PathwayDetailPage({ params }: { params: { pathwayId: string } }) {
  const { userProfile, setUserProfile, loading } = useUserProfile();

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
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-3">
              <GraduationCap className="text-primary h-6 w-6" /> {pathway.title.replace('Learning Pathway for: ', '')}
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
        </Card>
      </div>
    </AppShell>
  );
}
