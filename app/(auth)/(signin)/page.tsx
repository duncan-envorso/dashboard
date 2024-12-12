'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import AuthTabs from '@/components/authTabs';
import Image from 'next/image';

export default function AuthenticationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect authenticated users to the dashboard
    if (session) {
      router.push('/dashboard');
    }
  }, [router, session]);

  // Show loading state while the session is being fetched
  if (status === 'loading') {
    return <div>Loading...</div>; // You can replace this with a better loading spinner or component
  }

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Logo Column */}
      <div className="relative hidden h-full flex-col bg-muted text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />

        {/* Centered Logo Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/images/Envorso-Logo.webp"
              alt="Envorso Logo"
              width={250}
              height={90}
              className="dark:invert dark:filter"
            />
            <span className="text-sm text-zinc-400">Powered by Envorso</span>
          </div>
        </div>
      </div>

      {/* Auth Tabs Column */}
      <AuthTabs />
    </div>
  );
}
