'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Plus, Search, Edit2, Eye } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

type Post = {
  id: number;
  title: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
};

type Props = {
  initialPosts: Post[];
};

export default function BlogPostList({ initialPosts }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts] = useState<Post[]>(initialPosts);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-none shadow-none bg-slate-100">
      <CardContent className="p-6">
        <div className='flex justify-between items-center mb-6'>
          <div className="relative">
            <Search className="absolute left-3 pr-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr- py-2 w-full sm:w-80 bg-white shadow-sm border-none rounded-full focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <Link href="/dashboard/news-articles/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </Link>
        </div>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className=''>
                <TableHead className="w-[40%] pl-4 text-bold">Title</TableHead>
                <TableHead className="pl-4">Author</TableHead>
                <TableHead className="pl-4">Status</TableHead>
                <TableHead className="pl-4">Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='text-xs'>
              {filteredPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/50 transition-colors text-sm">
                  <TableCell className="text-sm pl-4">{post.title}</TableCell>
                  <TableCell className="pl-4">{post.author}</TableCell>
                  <TableCell className="pl-4">
                    <Badge
                      variant={post.status === 'published' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pl-4">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right pl-4">
                    <Button variant="ghost" size="sm" className="mr-2">
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