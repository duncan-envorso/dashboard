import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PlusIcon, Search } from 'lucide-react';
import Link from 'next/link';

const CommentaryHeader: React.FC = () => {
  return (
    <header className="bg-background">
      <div className="flex items-center justify-between px-4 py-2">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Dashboard
          </Link>
          <span>&gt;</span>
          <span>Live Commentary</span>
        </nav>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg border border-muted-foreground bg-background py-1.5 pl-8 text-foreground"
          />
        </div>
      </div>
      <div className="flex items-center justify-between  px-4 py-2">
        <nav className="flex space-x-4">
          {/* Add navigation items here if needed */}
        </nav>
      </div>
    </header>
  );
};

export default CommentaryHeader;
