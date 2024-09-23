'use server'

import Header from "@/components/home/Header";

import HeroSection from "@/components/home/HeroSection";
import { rugbyData } from "@/public/data";




export default async function Home() {
  return (
    
    <main className="flex flex-col min-h-screen">
      <Header />
      <HeroSection upcomingMatch={rugbyData.upcomingMatchesData[0]} />
      {/* <SeawolvesPerformanceTracker pastMatchesData={rugbyData.pastMatchesData} /> */}
      {/* <FeaturesSection />
      <CTASection /> */}
     
    </main>
  )
}