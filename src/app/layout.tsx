import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { UserProfileProvider } from '@/hooks/use-user-profile.tsx';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CareerCompassAI',
  description: 'Your AI-powered career navigation tool.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={cn('font-body antialiased', inter.variable)}>
        <UserProfileProvider>
          {children}
          <Toaster />
        </UserProfileProvider>
      </body>
    </html>
  );
}
