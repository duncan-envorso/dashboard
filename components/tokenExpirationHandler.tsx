// components/auth/TokenExpirationHandler.tsx
'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export function TokenExpirationHandler({
  children
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      toast({
        title: 'Session Expired',
        description: 'Please sign in again to continue.',
        variant: 'destructive'
      });

      // Redirect to sign in
      router.push('/');
      signIn();
    }
  }, [session, router]);

  return <>{children}</>;
}
