// File: app/(pages)/news/page.tsx
import { Suspense } from 'react';
import NewsPageComponent from './_components/news-component'
import { NewsPost } from "@/types"
import Header from '@/components/home/Header'
import { notFound } from 'next/navigation';

async function getNewsPosts(): Promise<NewsPost[]> {
  try {
    const response = await fetch('https://api.seawolves.envorso.com/v1/articles?teamId=17a788b5-2ac6-41d6-a320-f4d75cdd08b9', {
      headers: {
        'x-client-app-version': '2.0.17'
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news posts');
    }

    const posts = await response.json();
    
    return posts


  } catch (error) {
    console.error('Error fetching news posts:', error);
    notFound(); // This will render the closest not-found page
  }
}



export default async function NewsPage() {
  const posts = await getNewsPosts();

  return (
    <div className="container mx-auto p-4">
      <div className='mb-32'>
        <Header isTransparent={false} />
      </div>
      <Suspense fallback={<div>Loading news...</div>}>
        <NewsPageComponent posts={posts} />
      </Suspense>
    </div>
  )
}