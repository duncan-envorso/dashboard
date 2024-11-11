'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { Badge } from "@/components/ui/badge";
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
                      'flex items-center justify-between gap-2 rounded-md py-2 text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-accent text-secondary-foreground'
                        : 'text-primary-foreground hover:bg-secondary hover:text-secondary-foreground',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className={cn(
                        'ml-3 h-5 w-5 flex-shrink-0',
                        isActive ? 'text-secondary-foreground' : 'text-primary-foreground'
                      )} />
                      {!isMinimized && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </span>
                    {!isMinimized && item.badge && (
                      <Badge 
                        variant="outline" 
                        className="mr-3 bg-yellow-500/20 text-white-700 dark:text-yellow-400 text-[6px] whitespace-nowrap"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={cn(
                    !isMinimized ? 'hidden' : 'inline-block',
                    'bg-background text-foreground border border-primary'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <Badge 
                        variant="outline" 
                        className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs whitespace-nowrap"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
}