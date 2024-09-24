// File: app/(pages)/news/page.tsx

import { news } from '@/public/data/news'
import NewsPageComponent from './_components/news-component'
import { NewsPost } from "@/types"
import Header from '@/components/home/Header'

async function getNewsPosts(): Promise<NewsPost[]> {
  return news
}

export default async function NewsPage() {
  const posts = await getNewsPosts()
  return (
    <div className="container mx-auto p-4">
      <div className='mb-32'>
      <Header isTransparent={false} />
      </div>
      <div>
      <NewsPageComponent posts={posts} />
      </div>
    </div>
  )
}