'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Team {
  name: string
  shortName: string
  wins: number
  losses: number
  draws: number
  image_path: string
}

interface Match {
  venue: string
  start_time: string
  round: number
  name: string
  match_id: string
  match_type: string
  home_score: number
  away_score: number
  homeTeam: Team
  awayTeam: Team
}

interface MatchesSectionProps {
  pastMatchesData: Match[]
}

export default function MatchesSection({ pastMatchesData }: MatchesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextMatch = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pastMatchesData.length)
  }

  const prevMatch = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pastMatchesData.length) % pastMatchesData.length)
  }

  useEffect(() => {
    const timer = setInterval(nextMatch, 5000)
    return () => clearInterval(timer)
  }, [])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const match = pastMatchesData[currentIndex]

  return (
    <div className="fixed bottom-0 left-0 right-0  pb-8 pt-4">
      <div className="container mx-auto px-4 max-w-129">
        <h2 className="text-4xl font-bold text-white text-center mb-8 tracking-wider">Recent Matches</h2>
      <div className="relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={match.match_id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="rounded-2xl shadow-2xl overflow-hidden border border-green"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">
              <TeamInfo team={match.homeTeam} isHome={true} />
              <MatchDetails match={match} />
              <TeamInfo team={match.awayTeam} isHome={false} />
            </div>
            <div className="bg-gradient-to-r from-navy to-green p-4">
              <div className="text-white text-center font-semibold tracking-wide">{match.match_type}</div>
            </div>
          </motion.div>
        </AnimatePresence>
        <NavigationButton direction="prev" onClick={prevMatch} />
        <NavigationButton direction="next" onClick={nextMatch} />
      </div>
      <div className="mt-8 text-center">
        {/* Add match navigation dots or other UI elements here */}
      </div>
    </div>
    </div>
  )
}

const TeamInfo = ({ team, isHome }: { team: Team; isHome: boolean }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="relative">
      <Image
        src={team.image_path}
        alt={team.name}
        width={120}
        height={120}
        className="rounded-full border-4 border-green"
      />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-green opacity-30"></div>
    </div>
    <h3 className="text-2xl font-semibold mt-4 text-white">{team.name}</h3>
    <p className="text-sm text-gray-300 mt-2">
      {team.wins}W - {team.losses}L - {team.draws}D
    </p>
    <div className={`w-16 h-1 mt-3 ${isHome ? 'bg-green' : 'bg-white'} rounded-full`}></div>
  </div>
)

const MatchDetails = ({ match }: { match: Match }) => (
  <div className="flex flex-col items-center justify-center text-white">
    <div className="text-6xl font-bold mb-6 tracking-widest">
      {match.home_score} - {match.away_score}
    </div>
    <div className="text-sm text-gray-300">{new Date(match.start_time).toLocaleDateString()}</div>
    <div className="text-lg font-semibold mt-3">{match.venue}</div>
    <div className="text-sm text-gray-300 mt-2">Round {match.round}</div>
  </div>
)

const NavigationButton = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`absolute ${direction === 'prev' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 
    bg-gradient-to-r from-navy to-green hover:from-green hover:to-navy 
    rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green`}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} match`}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="w-8 px-2 h-8 text-white" />
    ) : (
      <ChevronRight className="w-8 h-8 text-white" />
    )}
  </button>
)