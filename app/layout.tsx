// layout.tsx
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import authConfig from '@/auth.config';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seattle Seawolves Admin Dashboard | Team Management',
  description:
    'Internal administrative dashboard for Seattle Seawolves Rugby Club staff. Manage roster, content, merchandise, and team operations.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>
          <ThemeProvider>
            {children}

            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
