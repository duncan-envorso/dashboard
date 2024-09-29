'use client'

import React from 'react'
import Header from '@/components/home/Header'

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isTransparent={false} />
      <main className="flex-grow container mx-auto p-4 mt-24">
        {children}
      </main>
    </div>
  )
}