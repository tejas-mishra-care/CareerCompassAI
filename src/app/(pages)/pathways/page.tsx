import { AppShell } from '@/components/layout/app-shell';
import { LearningPathwayGenerator } from '@/components/pathways/learning-pathway-generator';

export default function PathwaysPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Learning Pathways
          </h1>
        </div>
        <p className="text-muted-foreground">
          Generate a step-by-step guide to learn a new skill or enter a new profession.
        </p>
        <LearningPathwayGenerator />
      </div>
    </AppShell>
  );
}
