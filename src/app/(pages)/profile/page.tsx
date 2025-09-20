
'use client';

import { AppShell } from '@/components/layout/app-shell';
import { OnboardingStepper } from '@/components/onboarding/onboarding-stepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfileSetupPage() {
  return (
    <AppShell>
      <div className="flex justify-center items-start p-4 md:p-8">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Profile Calibration Journey</CardTitle>
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
