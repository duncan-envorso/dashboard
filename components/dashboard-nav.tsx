'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];
          const isActive = path === item.href;
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.disabled ? '/' : item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md py-2 text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-green text-white'
                        : 'text-white hover:bg-green hover:text-white',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <Icon className={cn(
                      'ml-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-white'
                    )} />
                    {!isMinimized && (
                      <span className="truncate">{item.title}</span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={cn(
                    !isMinimized ? 'hidden' : 'inline-block',
                    'bg-white text-navy border border-green'
                  )}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
}