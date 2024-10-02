import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../app/utils/themeInitializer'
import { SessionProvider } from 'next-auth/react'
import HeapAnalytics from '@/hooks/heapAnalytics'
import { ThemeProvider } from '@/components/ThemeProvider'
import Providers from '@/components/layout/providers';
import { auth } from '@/auth';
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rugby Team Landing Page',
  description: 'Welcome to our rugby team\'s official website',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100 text-foreground`}>
    <SessionProvider>
          <ThemeProvider>
            <HeapAnalytics />
            <Toaster   />
            {children}
          </ThemeProvider>
     </SessionProvider>
        {/* <Footer /> */}
      </body>
    </html>
  )
}