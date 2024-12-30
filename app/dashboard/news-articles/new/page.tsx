'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import BlogEditor from '@/components/blog/Tiptap';
import { useSession } from 'next-auth/react';

export default function NewPostPage() {
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const session = useSession();
  const teamId = session.data?.user.teamId;
  const token = session.data?.user.token;

  useEffect(() => {
    // Check for draft in localStorage
    const draft = localStorage.getItem('articleDraft');
    if (draft) {
      setHasUnsavedChanges(true);
    }

    // Warn before closing/reloading if there are unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Redirect if no teamId is provided
  useEffect(() => {
    if (!teamId) {
      router.push('/dashboard/news-articles');
    }
  }, [teamId, router]);

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      setIsAlertOpen(true);
    } else {
      router.push('/dashboard/news-articles');
    }
  };

  const handleConfirmGoBack = () => {
    // Clear draft from localStorage
    localStorage.removeItem('articleDraft');
    setIsAlertOpen(false);
    router.push('/dashboard/news-articles');
  };

  if (!teamId) {
    return null; // or loading state
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogEditor goBack={handleGoBack} teamId={teamId} />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to go back?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmGoBack}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
