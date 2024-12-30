'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BlogEditor from '@/components/blog/Tiptap';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import type { Article } from '@/types/newsarticle';
import { customFetch } from '@/lib/customFetch';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const session = useSession();
  const teamId = session.data?.user.teamId;
  const token = session.data?.user.token;

  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      if (!params.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await customFetch(`/articles/${params.id}`);
        console.log('response', response);

        setArticle(response);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [params.id, token]);
  const handleGoBack = () => setIsAlertOpen(true);
  const handleConfirmGoBack = () => {
    setIsAlertOpen(false);
    router.push('/dashboard/news-articles');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="">
      <BlogEditor post={article} goBack={handleGoBack} teamId={teamId || ' '} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to go back?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGoBack}>
              Yes, go back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
