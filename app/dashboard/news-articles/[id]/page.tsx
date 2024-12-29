// app/dashboard/news-articles/[id]/page.tsx
import { getArticle } from '@/app/actions';
import ArticleView from '@/components/news-articles/ArticleView';
import { notFound } from 'next/navigation';

export default async function ArticlePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (!id) return notFound();

  try {
    const article = await getArticle(id);
    if (!article) return notFound();

    return <ArticleView article={article} />;
  } catch (error) {
    console.error('Error fetching article:', error);
    return notFound();
  }
}
