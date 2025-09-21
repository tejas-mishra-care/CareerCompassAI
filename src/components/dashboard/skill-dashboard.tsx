
'use client';

import { useUserProfile } from '@/hooks/use-user-profile.tsx';
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
import { SkillRadarChart } from './skill-radar-chart';

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
        <CardTitle>
            <BrainCircuit className="h-6 w-6 inline-block mr-2" />
            Skill Dashboard
        </CardTitle>
        <CardDescription>
          Your quantified skills and proficiency levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
         <div className="flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
        </div>
        <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                </div>
            ))}
        </div>
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
    <Card>
      <CardHeader>
        <CardTitle>
          <BrainCircuit className="h-6 w-6 inline-block mr-2" />
          My Profile Snapshot
        </CardTitle>
        <CardDescription>
          An overview of your skills and proficiency levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 items-center">
        <div className="h-full flex items-center justify-center">
            <SkillRadarChart skills={userProfile.skills} />
        </div>
        <div className="grid gap-6">
            {sortedSkills.slice(0, 5).map((skill) => (
            <SkillItem key={skill.name} skill={skill} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
