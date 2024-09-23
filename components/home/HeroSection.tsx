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
  const bgOpacity = useTransform(scrollYProgress, [0, 0], [0.7, 0.5]) // Increased opacity for a slight dark overlay
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
    <section ref={ref} className="relative h-[300vh] w-full">
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
            className="absolute inset-0 bg-black z-10"
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
              <h1 className="text-5xl md:text-7xl font-industry font-bold text-primary-foreground mb-6 leading-tight">
                <span className="">
                  DOMINATE THE FIELD
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-industry font-light">
                Experience the raw power and strategic brilliance of American Rugby
              </p>
              <div className="absolute  left-0 right-0 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 z-20">
                <div className="flex justify-center">
                  <Button variant="gooeyLeft" className="bg-secondary text-secondary-foreground px-8 py-6 text-lg rounded-full transition-colors duration-300 hover:bg-accent">
                    Join the Team
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button variant="expandIcon" className=" px-8 py-6 text-lg rounded-full text-accent transition-colors duration-300 border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Watch Highlights
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: textOpacity2 }}
            className="absolute inset-0 flex items-center justify-center w-full"
          >
            <div className="p-8 rounded-lg max-w-3xl backdrop-blur-sm bg-primary/80 z-10">
              <h2 className="text-3xl md:text-5xl font-industry font-bold mb-6 leading-tight">
                <span className="bg-clip-text font-bold text-primary-foreground">
                  UPCOMING MATCH
                </span>
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <Image src={upcomingMatch.homeTeam.image_path} alt={upcomingMatch.homeTeam.name} width={80} height={80} className="rounded-full" />
                  <span className="text-2xl font-bold ml-4 text-primary-foreground">{upcomingMatch.homeTeam.name}{' '}</span>
                </div>
                <div className="text-4xl font-bold text-primary-foreground">{' '} VS {' '}</div>
                <div className="flex items-center mt-4 md:mt-0">
                  <span className="text-2xl font-bold mr-4 text-primary-foreground">{upcomingMatch.awayTeam.name}</span>
                  <Image src={upcomingMatch.awayTeam.image_path} alt={upcomingMatch.awayTeam.name} width={80} height={80} className="rounded-full" />
                </div>
              </div>
              <div className="flex justify-center space-x-6 text-sm md:text-base">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-accent" />
                  <span className="text-primary-foreground">{format(new Date(upcomingMatch.start_time), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-accent" />
                  <span className="text-primary-foreground">{format(new Date(upcomingMatch.start_time), 'h:mm a')}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 text-accent" />
                  <span className="text-primary-foreground">{upcomingMatch.venue}</span>
                </div>
              </div>
              <Button className="bg-secondary text-secondary-foreground mt-6 px-8 py-4 text-lg rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:bg-accent">
                Get Tickets
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
