'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NewsPost } from "@/types"

export default function NewsPageComponent({posts}: {posts: NewsPost[]}) {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 5
  const totalPages = Math.ceil(posts.length / articlesPerPage)

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = posts.slice(indexOfFirstArticle, indexOfLastArticle)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const extractImageSrc = (content: string) => {
    const match = content.match(/<img.*?src="(.*?)"/)
    return match ? match[1] : null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Rugby News</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.map((article: NewsPost) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg bg-white transition-shadow duration-300 flex flex-col">
            <div className="relative h-72 w-full">
              <Suspense>
              <Image
                src={extractImageSrc(article.content.rendered) || "/placeholder.svg?height=200&width=400"}
                alt={article.title.rendered || "Rugby news"}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
              </Suspense> 
              <div className="absolute top-0 left-0 m-2">
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {article.type === 'post' ? 'News' : article.type}
                </Badge>
              </div>
            </div>
            <CardContent className="flex-grow">
              <Link href={article.link} className="block mt-2">
                <h2 className="text-xl font-bold hover:text-primary pt-2 transition-colors duration-200">
                  {article.title.rendered || article.slug}
                </h2>
              </Link>
              <p className="mt-2 text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }} />
            </CardContent>
            <CardFooter className="bg-primary/90 pt-4 text-muted text-sm">
              <div className="flex justify-between items-center w-full">
                <span>{format(new Date(article.date), 'MMM dd, yyyy')}</span>
                <Link href={article.link} className="text-muted hover:underline">Read more</Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}