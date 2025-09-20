import { AppShell } from '@/components/layout/app-shell';
import { CareerSearch } from '@/components/search/career-search';

export default function SearchPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Search Careers
          </h1>
        </div>
        <CareerSearch />
      </div>
    </AppShell>
  );
}
