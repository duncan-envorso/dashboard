import React from 'react'
import { Input } from "../ui/input"
import { Button } from '../ui/button'
import { PlusIcon, Search } from 'lucide-react'
import Link from 'next/link'

const CommentaryHeader: React.FC = () => {
    return (
        <header className="bg-background">
            <div className="flex items-center justify-between px-4 py-2">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href="/dashboard" className="hover:text-primary">
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
                        className="w-full rounded-lg bg-background text-foreground pl-8 py-1.5 border border-muted-foreground"
                    />
                </div>
            </div>
            <div className="flex items-center justify-between  px-4 py-2">
                <nav className="flex space-x-4">
                    {/* Add navigation items here if needed */}
                </nav>
               
            </div>
        </header>
    )
}

export default CommentaryHeader
