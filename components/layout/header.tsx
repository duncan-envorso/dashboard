import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-transparent z-50  ">
      <nav className="flex items-center justify-between px-4 py-2 lg:justify-end">
      <div className={cn('block lg:hidden')}>
        <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
          {/* <ThemeToggle /> */}
        </div>
      </nav>
    </header>
  );
}
