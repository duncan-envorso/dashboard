import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css';
import '../app/utils/themeInitializer';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rugby Team Landing Page',
  description: 'Welcome to our rugby team\'s official website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100 text-foreground`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        {/* <Footer /> */}
      </body>
    </html>
  )
}