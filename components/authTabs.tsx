'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';
import UserAuthForm from './forms/user-auth-form';

// Define the motion component with proper typing
const MotionDiv = motion.div as React.ComponentType<HTMLMotionProps<'div'>>;

const AuthTabs = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Welcome
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-2">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <UserAuthForm />
              </MotionDiv>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <UserAuthForm isSignUp />
              </MotionDiv>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthTabs;
