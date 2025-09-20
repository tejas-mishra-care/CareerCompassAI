'use client';

import { useUserProfile } from '@/hooks/use-user-profile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, Star } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const getProficiencyTier = (proficiency: number) => {
  if (proficiency >= 80) return { name: 'Expert', color: 'text-primary' };
  if (proficiency >= 60) return { name: 'Advanced', color: 'text-green-500' };
  if (proficiency >= 40) return { name: 'Intermediate', color: 'text-yellow-500' };
  if (proficiency >= 20) return { name: 'Beginner', color: 'text-orange-500' };
  return { name: 'Novice', color: 'text-red-500' };
};

export function SkillDetailsList() {
  const { userProfile, loading } = useUserProfile();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile || userProfile.skills.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <BrainCircuit className="h-6 w-6" />
            My Skills
          </CardTitle>
          <CardDescription>
            Your skills will appear here once you complete your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No skills to display yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedSkills = [...userProfile.skills].sort(
    (a, b) => b.proficiency - a.proficiency
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit className="h-6 w-6" />
          Detailed Skill Breakdown
        </CardTitle>
        <CardDescription>
          A complete list of your quantified skills and proficiency levels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Skill</TableHead>
              <TableHead className="w-1/3 text-center">Proficiency Level</TableHead>
              <TableHead className="w-1/3 text-right">Skill Points (SP)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSkills.map((skill) => {
              const tier = getProficiencyTier(skill.proficiency);
              return (
                <TableRow key={skill.name}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className={`font-semibold ${tier.color} flex items-center gap-1`}>
                        <Star className="h-4 w-4" />
                        {tier.name}
                      </span>
                      <Progress value={skill.proficiency} className="h-2 mt-1 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-primary">
                    {skill.proficiency} SP
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
