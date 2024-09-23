'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'

type Post = {
  id: number;
  title: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
}

type Props = {
  initialPosts: Post[];
}

export default function BlogPostList({ initialPosts }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full hover-lift glassmorphism">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-primary">Blog Posts</CardTitle>
            <CardDescription className="text-muted-foreground">Manage your blog posts here.</CardDescription>
          </div>
          <Link href="/dashboard/news-articles/new">
            <Button className="btn-gradient active-shrink">
              <Plus className="mr-2 h-4 w-4" /> Create New Post
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-muted text-muted-foreground"
          />
        </div>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] text-primary">Title</TableHead>
                <TableHead className="text-primary">Author</TableHead>
                <TableHead className="text-primary">Status</TableHead>
                <TableHead className="text-right text-primary">Created At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/50 transition-smooth">
                  <TableCell className="font-medium text-foreground">{post.title}</TableCell>
                  <TableCell className="text-muted-foreground">{post.author}</TableCell>
                  <TableCell>
                    <Badge
                      variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'destructive'}
                      className="capitalize"
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/news-articles/${post.id}/edit`}>
                      <Button variant="ghost" size="sm" className="hover:text-accent transition-smooth">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
