import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-transparent  ">
      <nav className="flex items-center justify-between px-4 py-2 lg:justify-end">
        <div className={cn('block lg:hidden')}>
          <MobileSidebar />
        </div>
        <div className="mb-3 mr-40 flex items-center gap-2">
          <UserNav />
          {/* <ThemeToggle /> */}
        </div>
      </nav>
    </header>
  );
}
