'use client';

import { useUserProfile } from '@/hooks/use-user-profile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit } from 'lucide-react';
import type { Skill } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const SkillItem = ({ skill }: { skill: Skill }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <p className="text-sm font-medium">{skill.name}</p>
      <p className="text-sm text-muted-foreground">{skill.proficiency}%</p>
    </div>
    <Progress value={skill.proficiency} aria-label={`${skill.name} proficiency ${skill.proficiency}%`} />
  </div>
);

const SkillDashboardSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <BrainCircuit className="h-6 w-6" />
            Skill Dashboard
        </CardTitle>
        <CardDescription>
          Your quantified skills and proficiency levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
                <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-1/4" />
                </div>
                <Skeleton className="h-2 w-full" />
            </div>
        ))}
      </CardContent>
    </Card>
)

export function SkillDashboard() {
  const { userProfile, loading } = useUserProfile();

  if (loading) {
    return <SkillDashboardSkeleton />;
  }

  if (!userProfile || userProfile.skills.length === 0) {
    return null;
  }

  const sortedSkills = [...userProfile.skills].sort((a, b) => b.proficiency - a.proficiency);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-2xl">
          <BrainCircuit className="h-6 w-6" />
          Skill Dashboard
        </CardTitle>
        <CardDescription>
          Your quantified skills and proficiency levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {sortedSkills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </CardContent>
    </Card>
  );
}
