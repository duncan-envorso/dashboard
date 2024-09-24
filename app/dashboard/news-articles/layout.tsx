export const metadata = {
  title: 'Blog Posts',
  description: 'Manage your blog posts',
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 