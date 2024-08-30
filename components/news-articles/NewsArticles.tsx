// components/NewsArticles.tsx

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import NewsArticleHeader from './NewsArticleHeader'

const NewsArticlesComponent: React.FC = () => {
  return (
    <div >
       <NewsArticleHeader />
      <Card className='m-5' >
        <CardHeader>
          <CardTitle>News Articles</CardTitle>
          <CardDescription>Members can create, update, and publish news articles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Example data row - replace with dynamic content */}
              <TableRow>
                <TableCell className="font-medium">Example Title</TableCell>
                <TableCell>Example Author</TableCell>
                <TableCell>Published</TableCell>
                <TableCell>2024-08-29</TableCell>
                <TableCell>
                  <span className="sr-only">Actions</span>
                  {/* Add actions if needed */}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewsArticlesComponent
