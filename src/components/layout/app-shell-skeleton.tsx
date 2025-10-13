
import { Skeleton } from "@/components/ui/skeleton"
import { Compass, BrainCircuit } from 'lucide-react';

export function AppShellSkeleton() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar Skeleton */}
      <div className="hidden md:flex flex-col h-screen w-[52px] border-r p-2 gap-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="flex flex-col gap-2 flex-grow">
            {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
        </div>
      </div>
      
      <div className="flex flex-col flex-1">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2">
                {/* Mobile Nav Trigger Skeleton */}
                 <Skeleton className="h-9 w-9 shrink-0 md:hidden" />
                 
                {/* Desktop Trigger & Title Skeleton */}
                 <Skeleton className="h-7 w-7 hidden md:block" />
                 <div className="items-center gap-2 hidden md:flex">
                    <BrainCircuit className="h-6 w-6 text-muted" />
                    <Skeleton className="h-5 w-36" />
                </div>
            </div>
            
             {/* User Nav Skeleton */}
            <Skeleton className="h-8 w-8 rounded-full" />
        </header>

        {/* Main Content Skeleton */}
        <main className="flex-1 p-4 md:p-8 pt-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
           <Skeleton className="h-4 w-1/2" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="lg:col-span-2 h-64 rounded-lg" />
            <Skeleton className="lg:col-span-1 h-64 rounded-lg" />
            <Skeleton className="col-span-full h-48 rounded-lg" />
          </div>
        </main>
      </div>
    </div>
  )
}
