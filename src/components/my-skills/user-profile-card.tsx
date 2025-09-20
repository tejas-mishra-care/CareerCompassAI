'use client';

import { useUserProfile } from '@/hooks/use-user-profile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';

const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
};

export function UserProfileCard() {
  const { userProfile, loading } = useUserProfile();

  if (loading) {
    return (
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
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
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
    </Card>
  );
}
