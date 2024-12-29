// providers.tsx
'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from 'next-auth/react';

export default function Providers({
  // @ts-ignore
  session,
  children
}: {
  session: any;
  children: React.ReactNode;
}) {
  return (
    // @ts-ignore
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
