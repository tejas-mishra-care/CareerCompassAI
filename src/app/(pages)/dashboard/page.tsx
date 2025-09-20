
'use client';

import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { SkillDashboard } from '@/components/dashboard/skill-dashboard';
import { Recommendations } from '@/components/dashboard/recommendations';
import { MyActivePathways } from '@/components/dashboard/active-pathways';
import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { ProfileProcessor } from '@/components/dashboard/profile-processor';

export default function DashboardPage() {
  const { userProfile, isProfileComplete } = useUserProfile();

  const needsOnboarding = !userProfile?.onboardingCompleted && !isProfileComplete;
  const needsProcessing = userProfile?.onboardingCompleted && !isProfileComplete;

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard
          </h1>
        </div>
        {needsOnboarding ? (
          <WelcomeCard />
        ) : needsProcessing ? (
          <ProfileProcessor />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-6">
              <SkillDashboard />
              <MyActivePathways />
            </div>
            <div className="lg:col-span-1">
              <Recommendations />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
