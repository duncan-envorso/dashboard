'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Plus, Search, Edit2, Eye } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { Article, ArticleType } from '@/types/newsarticle';
import { useRouter } from 'next/navigation';

type Props = {
  initialPosts: Article[];
};

export default function BlogPostList({ initialPosts = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts] = useState<Article[]>(initialPosts);
  const router = useRouter();

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeVariant = (type: ArticleType) => {
    switch (type) {
      case 'news':
        return 'default';
      case 'match_report':
        return 'secondary';
      case 'announcement':
        return 'outline';
      case 'press_release':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card className="border-none bg-slate-100 shadow-none">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform pr-2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border-none bg-white py-2 pl-10 pr-4 shadow-sm transition-all focus:ring-2 focus:ring-primary/50 sm:w-80"
            />
          </div>
          <Link href="/dashboard/news-articles/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Create Article
            </Button>
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-bold w-[40%] pl-4">Title</TableHead>
                <TableHead className="pl-4">Type</TableHead>
                <TableHead className="pl-4">Date Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="text-sm transition-colors hover:bg-muted/50"
                >
                  <TableCell className="pl-4 text-sm">{post.title}</TableCell>
                  <TableCell className="pl-4">
                    <Badge
                      variant={getBadgeVariant(post.type)}
                      className="capitalize"
                    >
                      {post.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="pl-4">
                    {post.date_formatted
                      ? new Date(post.date_formatted).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="pl-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() =>
                        router.push(`/dashboard/news-articles/${post.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/dashboard/news-articles/${post.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
