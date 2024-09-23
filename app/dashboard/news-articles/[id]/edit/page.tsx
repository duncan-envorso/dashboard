'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BlogEditor from '@/components/blog/Tiptap'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function NewPostPage() {
  const router = useRouter()
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleGoBack = () => {
    setIsAlertOpen(true)
  }

  const handleConfirmGoBack = () => {
    setIsAlertOpen(false)
    router.back()
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="w-full hover-lift glassmorphism">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight text-primary">Create New Blog Post</CardTitle>
              <CardDescription className="text-muted-foreground">Write and publish your new blog post here.</CardDescription>
            </div>
            <Button
              onClick={handleGoBack}
              variant="expandIcon"
              size="sm"
              className="hover:bg-primary/90 active-shrink transition-smooth"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BlogEditor />
        </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to go back?</AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGoBack}>Yes, go back</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}