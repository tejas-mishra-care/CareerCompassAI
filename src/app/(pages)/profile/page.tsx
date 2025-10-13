
'use client';

import { AppShell } from '@/components/layout/app-shell';
import { OnboardingStepper } from '@/components/onboarding/onboarding-stepper';
import { UserProfileDisplay } from '@/components/profile/user-profile-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { userProfile, loading, isProfileComplete } = useUserProfile();

  if (loading) {
    return (
        <AppShell>
            <div className="flex justify-center items-start p-4 md:p-8">
                <Card className="w-full max-w-4xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    )
  }

  // If onboarding is NOT completed, show the stepper
  if (!userProfile?.onboardingCompleted) {
    return (
        <AppShell>
            <div className="flex justify-center items-start p-4 md:p-8">
                <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Profile Calibration Journey</CardTitle>
                    <CardDescription>
                    Welcome! Let's build your personalized Compass. This will take about 5-7 minutes and will help us understand your unique journey so far.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <OnboardingStepper />
                </CardContent>
                </Card>
            </div>
        </AppShell>
    );
  }

  // If onboarding IS completed, show the user's profile
  return (
    <AppShell>
       <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            My Profile
          </h1>
        </div>
        <UserProfileDisplay />
      </div>
    </AppShell>
  );
}
