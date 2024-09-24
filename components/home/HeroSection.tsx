'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface UpcomingMatch {
  venue: string
  start_time: string
  round: number
  name: string
  match_id: string
  match_type: string
  home_score: number
  away_score: number
  homeTeam: {
    name: string
    shortName: string
    wins: number
    losses: number
    draws: number
    image_path: string
  }
  awayTeam: {
    name: string
    shortName: string
    wins: number
    losses: number
    draws: number
    image_path: string
  }
}

interface HeroSectionProps {
  upcomingMatch: UpcomingMatch
}

export default function HeroSection({ upcomingMatch }: HeroSectionProps) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const textOpacity1 = useTransform(scrollYProgress, [0.05, 0.1, 0.15], [1, 0, 0])
  const textOpacity2 = useTransform(scrollYProgress, [0.1, 0.3, 0.5], [0, 1, 0])
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.7, 0.5])

  const riseUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section ref={ref} className="fixed  h-[300vh] w-full">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0">
          <motion.video
            className="absolute w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            src="https://cdn.prod.website-files.com/65417651935f4a88a94aebb0/65d640d585ad7fb7ff91bd4d_highlight%20reel-transcode.webm"
          />
          <motion.div
            className="absolute inset-0 bg-secondary z-10"
            style={{ opacity: bgOpacity }}
          ></motion.div>
        </div>
        <div className="absolute inset-0 bg-[url('/rugby-pattern.png')] opacity-20 mix-blend-overlay z-10"></div>

        <motion.div
          className="relative text-center text-primary-foreground px-4 w-full z-20"
          initial="hidden"
          animate="visible"
          variants={riseUpVariants}
        >
          <motion.div
            style={{ opacity: textOpacity1 }}
            className="absolute inset-0 flex items-center justify-center w-full"
          >
            <div className="text-center w-full">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  DOMINATE THE FIELD
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 font-light text-secondary-foreground">
                Experience the raw power and strategic brilliance of American Rugby
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 z-20">
                <Button 
                  variant="default" 
                  className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-6 py-3 text-base sm:text-lg rounded-full transition-colors duration-300"
                >
                 Get Tickets
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary px-6 py-3 text-base sm:text-lg rounded-full transition-colors duration-300 border-primary-foreground"
                >
                  Watch Highlights
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}