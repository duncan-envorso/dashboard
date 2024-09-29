'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NewsPost } from "@/types"

export default function NewsPageComponent({ posts }: { posts: NewsPost[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 5
  const totalPages = Math.ceil(posts.length / articlesPerPage)

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = posts.slice(indexOfFirstArticle, indexOfLastArticle)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto p-4 border-none" >
      <h1 className="text-3xl font-bold text-foreground mb-6">Team News</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.map((article: NewsPost) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg bg-white transition-shadow duration-300 flex flex-col">
            <div className="relative h-72 w-full">
              <Suspense fallback={<div className="h-full w-full bg-gray-200"></div>}>
                <Image
                  src={article.image || "/placeholder.svg?height=200&width=400"}
                  alt={article.title || "Rugby news"}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </Suspense>
              <div className="absolute top-0 left-0 m-2">
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {article.type}
                </Badge>
              </div>
            </div>
            <CardContent className="flex-grow">
              <Link href={`/news/${article.id}`} className="block mt-2">
                <h2 className="text-xl font-bold hover:text-primary pt-2 transition-colors duration-200">
                  {article.title}
                </h2>
              </Link>
              {/* Remove the excerpt as it's not available in the new data format */}
            </CardContent>
            <CardFooter className="bg-primary/90 backdrop:blur-lg text-muted text-md py-3">
              <div className="flex justify-between items-center w-full">
                <span className="text-primary-foreground">{article.date_formatted}</span>
                <Link
                  href={`/news/${article.id}`}
                  className="text-primary-foreground hover:underline transition-colors duration-200"
                >
                  Read more
                </Link>
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