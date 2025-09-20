
'use client';

import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { BrainCircuit, Star, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '../ui/button';

const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
};


const getProficiencyTier = (proficiency: number) => {
  if (proficiency >= 80) return { name: 'Expert', color: 'text-primary' };
  if (proficiency >= 60) return { name: 'Advanced', color: 'text-green-500' };
  if (proficiency >= 40) return { name: 'Intermediate', color: 'text-yellow-500' };
  if (proficiency >= 20) return { name: 'Beginner', color: 'text-orange-500' };
  return { name: 'Novice', color: 'text-red-500' };
};

export function UserProfileDisplay() {
  const { userProfile, loading } = useUserProfile();

  if (loading) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="items-center text-center">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-8 w-40 mt-4" />
                    </CardHeader>
                    <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
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
            </div>
        </div>
    );
  }

  if (!userProfile) {
    return <p>No profile data available. Please complete onboarding.</p>;
  }

  const sortedSkills = [...userProfile.skills].sort(
    (a, b) => b.proficiency - a.proficiency
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader className="items-center text-center">
                    <Avatar className="h-24 w-24 text-3xl mb-2">
                        <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-2xl">{userProfile.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-center whitespace-pre-line">
                        {userProfile.bio || "No bio yet. Complete your onboarding to generate one!"}
                    </CardDescription>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" disabled>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile (Coming Soon)
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-2">
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
        </div>
    </div>
  );
}
