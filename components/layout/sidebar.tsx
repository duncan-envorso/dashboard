'use client';

import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft, Moon, Sun } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    toggle();
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-col border-r transition-all duration-300 ease-in-out md:flex`,
        isMinimized ? 'w-[72px]' : 'w-72',
        'bg-navy text-white ',
        className
      )}
    >
      <div className="flex items-center justify-center p-5 pt-10">
        <Link href="/">
          <Image
            src="/images/logo.webp"
            alt="Seattle Seawolves"
            width={isMinimized ? 40 : 90}
            height={isMinimized ? 40 : 90}
          />
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute -right-3 top-20 z-50 rounded-full border bg-green text-white hover:bg-green-dark transition-colors',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="mt-3 space-y-1">
              <DashboardNav items={navItems} />
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-5 left-5 text-navy dark:text-white hover:bg-green hover:text-white dark:hover:bg-green dark:hover:text-navy"
        onClick={toggleTheme}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </aside>
  );
}