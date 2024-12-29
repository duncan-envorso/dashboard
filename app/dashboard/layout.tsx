import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import ThemeProvider from '@/components/ThemeProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'Seattle Seawolves Dashboard',
  description: 'Official dashboard for Chicago Hounds Rugby'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-industry flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="just flex min-h-screen w-full flex-col items-start justify-start bg-slate-100">
        <ScrollArea className="w-full">
          <div className=" p-10">
            <Header />
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
