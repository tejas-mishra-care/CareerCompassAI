'use client';

import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { useUserProfile } from '@/hooks/use-user-profile';
import { SkillDashboard } from '@/components/dashboard/skill-dashboard';
import { Recommendations } from '@/components/dashboard/recommendations';

export default function DashboardPage() {
  const { userProfile, isProfileComplete } = useUserProfile();

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard
          </h1>
        </div>
        {!isProfileComplete ? (
          <WelcomeCard />
        ) : (
          <div className="space-y-6">
            <SkillDashboard />
            <Recommendations />
          </div>
        )}
      </div>
    </AppShell>
  );
}
