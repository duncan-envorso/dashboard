'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export type Team = {
  name: string;
  shortName: string;
  wins: number;
  losses: number;
  draws: number;
  image_path: string;
};

export type Match = {
  venue: string;
  start_time: string; // Date as string in ISO format
  round: number;
  name: string;
  match_id: string;
  match_type: string;
  home_score: number;
  away_score: number;
  homeTeam: Team;
  awayTeam: Team;
};

export type MatchesData = {
  upcomingMatchesData: Match[];
  pastMatchesData: Match[];
};

const MatchCard: React.FC<{ match: Match }> = ({ match }) => (
  <Card className="mb-6 overflow-hidden bg-secondary/90 backdrop-blur-lg text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="p-0">
      <div className="bg-white/10 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <Badge variant="secondary" className="text-xs font-semibold bg-primary backdrop-blur-3xl  ">
        Round {' '}  {match.round}
     
        </Badge>
        <div className="flex items-center text-xs">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{new Date(match.start_time).toLocaleDateString()}</span>
          <Clock className="w-3 h-3 ml-3 mr-1" />
          <span>{new Date(match.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          
          <TeamInfo team={match.homeTeam} score={match.home_score} isHome />
          <div className="text-3xl font-bold mx-4">VS</div>
          <TeamInfo team={match.awayTeam} score={match.away_score} isHome={false} />
        </div>
        <div className="flex items-center justify-center text-sm bg-accent/50 rounded-full py-2 px-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{match.venue}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

const TeamInfo: React.FC<{ team: { name: string; image_path: string }, score: number, isHome: boolean }> = ({ team, score, isHome }) => (
  <div className={`flex flex-col items-center ${isHome ? 'text-right' : 'text-left'}`}>
    {isHome ? (<span className='pb-2'>Home</span>): <span className='pb-2'>Away</span> }
    <div className="relative mb-2">
      <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
      <Image
        src={team.image_path}
        width={64}
        height={64}
        alt={team.name}
        className="relative z-10 w-16 h-16 object-contain"
      />
    </div>
    <h3 className="font-bold text-lg mb-1">{team.name}</h3>
    <div className="flex items-center">
      {score > 0 && <Trophy className="w-4 h-4 mr-1 text-yellow-400" />}
      <span className="text-2xl font-extrabold">{score}</span>
    </div>
  </div>
)

interface RugbyMatchesDashboardProps {
  matchData: MatchesData;
}



const RugbyMatchesDashboard: React.FC<RugbyMatchesDashboardProps> = ({ matchData }) => {
  const [activeTab, setActiveTab] = useState('past');

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full bg-slate-100 border-none shadow-none">

        <h1 className="text-3xl font-bold text-foreground mb-6">Team Schedule</h1>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-primary text-primary-foreground h-12 text-2xl">
              <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
              <TabsTrigger value="past">Past Matches</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <ScrollArea className="h-[70vh] pr-4">
                {matchData.upcomingMatchesData.length === 0 ? (
                  <p className="text-center text-muted-foreground">No upcoming matches scheduled.</p>
                ) : (
                  matchData.upcomingMatchesData.map((match) => (
                    <MatchCard key={match.match_id} match={match} />
                  ))
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="past">
              <ScrollArea className="h-[70vh] pr-4">
                {matchData.pastMatchesData.map((match) => (
                  <MatchCard key={match.match_id} match={match} />
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RugbyMatchesDashboard;