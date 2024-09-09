import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seattle Seawolves Dashboard',
  description: 'Official dashboard for Seattle Seawolves Rugby'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-light-grey dark:bg-navy font-industry">
      <Sidebar className="bg-navy text-white w-80 flex-shrink-0" />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header  />
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-[1200px] dark:bg-navy mx-auto">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}