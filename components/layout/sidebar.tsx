'use client';

import React, { useState, useEffect } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft, Moon, Sun } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import AuthRedirectButton from '../AuthRedirectButton';

type SidebarProps = {
  className?: string;
};

// No need to transform the badges since they're already in the data
export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [logo, setLogo] = useState('/logos/seawolves-logo.png');

  useEffect(() => {
    const loadLogo = async () => {
      if (session?.user?.team) {
        const teamLogoPath = `/logos/${session.user.team}-logo.png`;
        try {
          const res = await fetch(teamLogoPath);
          if (res.ok) {
            setLogo(teamLogoPath);
          } else {
            setLogo('/logos/seawolves-logo.png');
          }
        } catch (error) {
          setLogo('/logos/seawolves-logo.png');
        }
      } else {
        setLogo('/logos/seawolves-logo.png');
      }
    };
    loadLogo();
  }, [session]);

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-col border-r transition-all duration-300 ease-in-out md:flex`,
        isMinimized ? 'w-[72px]' : 'w-72',
        'bg-primary text-primary-foreground',
        className
      )}
    >
      <div className="flex items-center justify-center p-5 pt-10">
        <Link href="/">
          <Image
            src={logo}
            alt="Team Logo"
            width={isMinimized ? 40 : 90}
            height={isMinimized ? 40 : 90}
          />
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute -right-3 top-20 z-50 rounded-full border bg-secondary text-secondary-foreground transition-colors hover:bg-accent',
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
    </aside>
  );
}
