
'use client';

import { useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { BrainCircuit, Star, Edit, GraduationCap, School } from 'lucide-react';
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
import { EditProfileDialog } from './edit-profile-dialog';

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

const EducationHistoryCard = () => {
    const { userProfile } = useUserProfile();
    const educationData = userProfile?.onboardingData;

    if (!educationData || (!educationData.higherEducation?.length && !educationData.board10th)) {
        return null; // Don't render the card if there's no education data at all
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <GraduationCap className="h-6 w-6 inline-block mr-2" />
                    Education & Academics
                </CardTitle>
                <CardDescription>
                    Your academic journey from school to higher education.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Higher Education */}
                {educationData.higherEducation?.map((edu: any, index: number) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold mt-1">
                            <School className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold">{edu.degree}</p>
                            <p className="font-medium text-muted-foreground">{edu.fieldOfStudy}</p>
                            <p className="text-sm text-muted-foreground">{edu.university}</p>
                            <p className="text-xs text-muted-foreground">{edu.year} &middot; Score: {edu.score}</p>
                        </div>
                    </div>
                ))}
                
                 {/* 12th Grade */}
                {educationData.stream12th && (
                     <div className="flex gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold mt-1">
                            12th
                        </div>
                        <div>
                            <p className="font-bold">{educationData.stream12th}</p>
                            <p className="text-sm text-muted-foreground">{educationData.board12th}</p>
                            <p className="text-xs text-muted-foreground">{educationData.year12th} &middot; Score: {educationData.score12th}%</p>
                        </div>
                    </div>
                )}

                {/* 10th Grade */}
                {educationData.board10th && (
                     <div className="flex gap-4">
                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold mt-1">
                            10th
                        </div>
                        <div>
                            <p className="font-bold">10th Standard</p>
                            <p className="text-sm text-muted-foreground">{educationData.board10th}</p>
                            <p className="text-xs text-muted-foreground">{educationData.year10th} &middot; Score: {educationData.score10th}%</p>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}


export function UserProfileDisplay() {
  const { user, userProfile, loading } = useUserProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
            <div className="lg:col-span-2 space-y-6">
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
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
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
    <>
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader className="items-center text-center">
                    <Avatar className="h-24 w-24 text-3xl mb-2">
                        <AvatarImage src={user?.photoURL ?? undefined} alt={userProfile.name} />
                        <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{userProfile.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-center whitespace-pre-line">
                        {userProfile.bio || "No bio yet. Complete your onboarding to generate one!"}
                    </CardDescription>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>
                    <BrainCircuit className="h-6 w-6 inline-block mr-2" />
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
            <EducationHistoryCard />
        </div>
    </div>
    <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </>
  );
}
