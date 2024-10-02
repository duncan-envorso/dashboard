'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AuthenticationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect authenticated users to the dashboard
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Show loading state while the session is being fetched
  if (status === 'loading') {
    return <div>Loading...</div>; // You can replace this with a better loading spinner or component
  }

  // If the user is authenticated, render nothing to avoid showing the authentication form
  if (status === 'authenticated') {
    return null;
  }
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign in 
            </p>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sign-in Instructions</AlertTitle>
            <AlertDescription>
              Use these mock credentials to sign in:
              <ul className="list-disc list-inside mt-2">
                <li>Email: john@chicago.com</li>
                <li>Password: password123</li>
              </ul>
              Or:
              <ul className="list-disc list-inside mt-2">
                <li>Email: jane@seawolves.com</li>
                <li>Password: password456</li>
              </ul>
            </AlertDescription>
          </Alert>

          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}