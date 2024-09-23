// app/dashboard/posts/page.tsx
import { Suspense } from 'react'
import BlogPostList from '@/components/blog/BlogPostList'
import { getPosts } from '@/app/actions'



export default async function PostsPage() {
  const posts = await getPosts()
  return (
    <div className="p-8 bg-pattern min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
      <BlogPostList initialPosts={posts} />
      </Suspense>
    </div>
  )
}
