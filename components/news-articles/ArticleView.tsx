// components/articles/ArticleView.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, ArrowLeft } from 'lucide-react';
import type { Article } from '@/types/newsarticle';
import Image from 'next/image';

export default function ArticleView({ article }: { article: Article }) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/news-articles')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() =>
              router.push(`/dashboard/news-articles/${article.id}/edit`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Article
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {article.image && (
            <Image
              height={500}
              width={500}
              src={article.image}
              alt={article.title}
              className="w-full rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{new Date(article.date_posted).toLocaleDateString()}</span>
              <span>Type: {article.type}</span>
              <span>Status: {article.status}</span>
            </div>
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.text }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
