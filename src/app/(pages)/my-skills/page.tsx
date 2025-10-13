import { AppShell } from '@/components/layout/app-shell';
import { SkillDetailsList } from '@/components/my-skills/skill-details-list';
import { UserProfileCard } from '@/components/my-skills/user-profile-card';

export default function MySkillsPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            My Skill Dashboard
          </h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <UserProfileCard />
          </div>
          <div className="lg:col-span-2">
            <SkillDetailsList />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
// Updated
