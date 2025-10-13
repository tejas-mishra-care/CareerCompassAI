import { AppShell } from '@/components/layout/app-shell';
import { UnifiedSearch } from '@/components/search/unified-search';

export default function SearchPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Explorer Hub
          </h1>
        </div>
        <p className="text-muted-foreground">
          Discover careers, skills, and courses tailored to you.
        </p>
        <UnifiedSearch />
      </div>
    </AppShell>
  );
}
// Updated
