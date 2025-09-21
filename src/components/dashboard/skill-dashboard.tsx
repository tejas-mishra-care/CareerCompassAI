
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SkillItem = ({ skill }: { skill: Skill }) => (
  <TableRow>
    <TableCell className="font-medium">{skill.name}</TableCell>
    <TableCell className="w-[150px]">
      <Progress value={skill.proficiency} aria-label={`${skill.name} proficiency ${skill.proficiency}%`} />
    </TableCell>
    <TableCell className="text-right w-[60px] font-mono">{skill.proficiency}%</TableCell>
  </TableRow>
);

const SkillDashboardSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle>
            <BrainCircuit className="h-6 w-6 inline-block mr-2" />
            My Profile Snapshot
        </CardTitle>
        <CardDescription>
          Loading your quantified skills...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-1/6" />
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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Proficiency</TableHead>
              <TableHead className="text-right">Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSkills.slice(0, 5).map((skill) => (
              <SkillItem key={skill.name} skill={skill} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
