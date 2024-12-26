'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, ArrowLeft } from 'lucide-react';
import type { Article } from '@/types/newsarticle';
import Image from 'next/image';

const API_BASE_URL = 'https://api.seawolves.envorso.com/v1';

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const session = useSession();
  const token = session.data?.user.token;
  const [article, setArticle] = useState<Article>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!params.id || !token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/articles/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [params.id, token]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!article) return <div>Article not found</div>;

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
              router.push(`/dashboard/news-articles/${params.id}/edit`)
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
