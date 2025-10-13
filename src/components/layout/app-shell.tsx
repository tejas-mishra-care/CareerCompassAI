
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
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
  HeartHandshake,
} from 'lucide-react';
import { UserNav } from './user-nav';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/my-skills',
    label: 'My Skills',
    icon: ClipboardList,
  },
  {
    href: '/pathways',
    label: 'Learning Pathways',
    icon: GraduationCap,
  },
  {
    href: '/simulations',
    label: 'Simulations',
    icon: SquareTerminal,
  },
  {
    href: '/explore',
    label: 'Explore Careers',
    icon: Bot,
  },
  {
    href: '/search',
    label: 'Search',
    icon: Search,
  },
  {
    href: '/community',
    label: 'Community',
    icon: Users,
  },
  {
    href: '/connect',
    label: 'Connect',
    icon: HeartHandshake,
  },
   {
    href: '/profile',
    label: 'My Profile',
    icon: UserIcon,
  },
];

const SidebarNavigation = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
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
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
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
  const { user, loading } = useUserProfile();
  
  if (loading) {
    return <AppShellSkeleton />;
  }

  // The navigation logic is centralized in UserProfileProvider
  if (!user) {
    return <AppShellSkeleton />;
  }
  
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="offcanvas">
        <SidebarContent className="pt-4">
          <SidebarNavigation />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <MobileNav />
            <div className="hidden md:block">
              <SidebarTrigger />
            </div>
            <Link href="/dashboard" className="items-center gap-2 hidden md:flex">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <h2 className="font-bold text-base font-headline">
                  CareerCompassAI
              </h2>
            </Link>
          </div>

          <div className="flex items-center gap-4">
              <UserNav />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
// Updated
