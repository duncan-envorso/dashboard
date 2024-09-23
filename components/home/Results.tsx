'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react'

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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextMatch = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pastMatchesData.length)
  }

  const prevMatch = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pastMatchesData.length) % pastMatchesData.length)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAutoPlaying) {
      timer = setInterval(nextMatch, 5000)
    }
    return () => clearInterval(timer)
  }, [isAutoPlaying])

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
    <div>
    <section className="bg-gradient-to-b from-navy to-green py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-white text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-green-300">
            Recent Matches
          </span>
        </h2>
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
              className="bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <TeamDisplay team={match.homeTeam} isHome={true} />
                <ScoreDisplay match={match} />
                <TeamDisplay team={match.awayTeam} isHome={false} />
              </div>
              <MatchInfoBar match={match} />
            </motion.div>
          </AnimatePresence>
          <NavigationButton direction="prev" onClick={prevMatch} />
          <NavigationButton direction="next" onClick={nextMatch} />
        </div>
        <ProgressBar currentIndex={currentIndex} totalMatches={pastMatchesData.length} />
        <AutoPlayToggle isAutoPlaying={isAutoPlaying} setIsAutoPlaying={setIsAutoPlaying} />
      </div>
    </section>
    </div>
  )
}

const TeamDisplay = ({ team, isHome }: { team: Team; isHome: boolean }) => (
  <motion.div 
    className="flex flex-col items-center justify-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: isHome ? 0.2 : 0.4 }}
  >
    <Image
      src={team.image_path}
      alt={team.name}
      width={120}
      height={120}
      className="rounded-full border-4 border-navy shadow-lg"
    />
    <h3 className="text-2xl font-semibold mt-4 text-navy">{team.name}</h3>
    <p className="text-sm text-gray-600 mt-2">
      {team.wins}W - {team.losses}L - {team.draws}D
    </p>
  </motion.div>
)

const ScoreDisplay = ({ match }: { match: Match }) => (
  <motion.div 
    className="flex flex-col items-center justify-center"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3, type: 'spring' }}
  >
    <div className="text-6xl font-bold mb-4 text-navy">
      {match.home_score} - {match.away_score}
    </div>
    <div className="flex items-center text-sm text-gray-600 mb-2">
      <Calendar className="w-4 h-4 mr-2" />
      {new Date(match.start_time).toLocaleDateString()}
    </div>
    <div className="flex items-center text-sm font-semibold mt-2 text-navy">
      <MapPin className="w-4 h-4 mr-2" />
      {match.venue}
    </div>
    <div className="text-xs text-gray-500 mt-1">Round {match.round}</div>
  </motion.div>
)

const MatchInfoBar = ({ match }: { match: Match }) => (
  <motion.div 
    className="bg-gradient-to-r from-navy to-green p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    <div className="text-white text-center font-semibold">{match.match_type}</div>
  </motion.div>
)

const NavigationButton = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`absolute ${direction === 'prev' ? 'left-0' : 'right-0'} top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green`}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} match`}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="w-8 h-8 text-navy" />
    ) : (
      <ChevronRight className="w-8 h-8 text-navy" />
    )}
  </motion.button>
)

const ProgressBar = ({ currentIndex, totalMatches }: { currentIndex: number; totalMatches: number }) => (
  <div className="mt-8 w-full bg-white bg-opacity-20 rounded-full h-2.5">
    <motion.div
      className="bg-green h-2.5 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${((currentIndex + 1) / totalMatches) * 100}%` }}
      transition={{ duration: 0.5 }}
    />
  </div>
)

const AutoPlayToggle = ({ isAutoPlaying, setIsAutoPlaying }: { isAutoPlaying: boolean; setIsAutoPlaying: (value: boolean) => void }) => (
  <div className="mt-6 flex justify-center">
    <button
      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
        isAutoPlaying ? 'bg-green text-white' : 'bg-white text-navy'
      }`}
    >
      {isAutoPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
    </button>
  </div>
)