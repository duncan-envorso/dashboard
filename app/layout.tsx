import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css';
import '../app/utils/themeInitializer';




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
      <body className={`${inter.className} bg-background text-foreground`}>
       
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  )
}