
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Bot,
  BrainCircuit,
  GraduationCap,
  LayoutDashboard,
  Search,
  Compass,
  ClipboardList,
  Users,
  SquareTerminal,
  User as UserIcon,
  Loader2,
} from 'lucide-react';
import { UserNav } from './user-nav';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { Skeleton } from '../ui/skeleton';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    authRequired: true,
  },
  {
    href: '/explore',
    label: 'Explore Careers',
    icon: Bot,
     authRequired: true,
  },
  {
    href: '/search',
    label: 'Search',
    icon: Search,
     authRequired: true,
  },
  {
    href: '/pathways',
    label: 'Learning Pathways',
    icon: GraduationCap,
     authRequired: true,
  },
  {
    href: '/my-skills',
    label: 'My Skills',
    icon: ClipboardList,
     authRequired: true,
  },
  {
    href: '/simulations',
    label: 'Simulations',
    icon: SquareTerminal,
     authRequired: true,
  },
  {
    href: '/connect',
    label: 'Connect',
    icon: Users,
     authRequired: true,
  },
   {
    href: '/profile',
    label: 'My Profile',
    icon: UserIcon,
    authRequired: true,
  },
];

const SidebarNavigation = () => {
  const pathname = usePathname();
  const { isProfileComplete } = useUserProfile();

  const visibleNavItems = navItems.filter(item => {
      if(item.href === '/profile') return isProfileComplete; // Only show profile link if complete
      return true;
  });

  return (
    <SidebarMenu>
      {visibleNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={{ children: item.label, side: 'right' }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Compass className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="flex flex-col p-0">
      <SheetHeader className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">CareerCompassAI</span>
        </Link>
      </SheetHeader>
      <ScrollArea className="flex-1">
        <nav className="grid gap-2 p-4">
          <SidebarNavigation />
        </nav>
      </ScrollArea>
    </SheetContent>
  </Sheet>
);

const AppShellSkeleton = () => (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
);


export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { user, loading } = useUserProfile();
  
  if (loading) {
    return <AppShellSkeleton />;
  }

  // The navigation logic is now centralized in UserProfileProvider
  if (!user) {
    return <AppShellSkeleton />;
  }
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex h-14 items-center gap-2 px-4">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <h2 className="font-bold text-base font-headline">
                CareerCompassAI
              </h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigation />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <MobileNav />
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Can be used for a global search */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
