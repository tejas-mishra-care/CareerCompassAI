
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
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import { EditProfileDialog } from '../profile/edit-profile-dialog';

const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
};

export function UserProfileCard() {
  const { user, userProfile, loading } = useUserProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    <>
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
    <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </>
  );
}
