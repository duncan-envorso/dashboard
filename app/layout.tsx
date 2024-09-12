import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { auth } from '@/auth';


export const metadata: Metadata = {
  title: 'Seattle Seawolves Dashboard',
  description: 'Official dashboard for Seattle Seawolves Rugby'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className="h-full">
      <body
        className={`overflow-hidden bg-light-grey  text-navy  h-full`}
        suppressHydrationWarning={true}
      >
        <NextTopLoader
          color="#64B246"
          showSpinner={false}
          shadow="0 0 10px #64B246,0 0 5px #64B246"
        />
        <Providers session={session}>
          <Toaster />
          <div className="flex flex-col h-full">
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-4 text-center text-sm text-navy bg-white ">
              © {new Date().getFullYear()} Seattle Seawolves. All rights reserved.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}