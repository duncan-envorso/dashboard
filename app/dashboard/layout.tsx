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
    

      <div className="flex h-screen bg-background text-foreground font-industry">
        <Sidebar />
        <main className="just bg-slate-100 flex flex-col items-start justify-start w-full min-h-screen">
       
          <ScrollArea className="w-full">
            <div className=" m-2">
            <Header />
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
     
   
  );
}