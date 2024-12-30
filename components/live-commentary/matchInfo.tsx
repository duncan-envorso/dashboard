'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LiveMatchData, Team } from '@/types/match';
import Image from 'next/image';

interface MatchInfoProps {
  matchInfo: LiveMatchData;
}

function TeamStats({ team }: { team: Team }) {
  return (
    <p className="text-sm text-primary-foreground">
      {`${team.wins ?? 0}W - ${team.losses ?? 0}L - ${team.draws ?? 0}D`}
    </p>
  );
}

function TeamLogo({ team }: { team: Team }) {
  return (
    <div className="relative h-16 w-16 rounded-md bg-background">
      <Image
        src={team.image_path || '/placeholder.svg'}
        alt={team.name}
        fill
        className="object-contain p-2"
        priority
      />
    </div>
  );
}

export default function MatchInfoCard({ matchInfo }: MatchInfoProps) {
  const { homeTeam, awayTeam, venue, matchType, round } = matchInfo;

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-primary/90">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Home Team */}
            <div className="flex flex-1 items-center gap-4">
              <TeamLogo team={homeTeam} />
              <div className="text-center md:text-left">
                <h3 className="font-bold text-primary-foreground">
                  {homeTeam.name}
                </h3>
                <TeamStats team={homeTeam} />
              </div>
            </div>

            {/* Match Info */}
            <div className="flex-shrink-0 text-center">
              <div className="mb-2 text-2xl font-bold text-primary-foreground">
                VS
              </div>
              <div className="text-sm text-primary-foreground">
                {round ? `Round ${round}` : ''}
                {matchType ? `${round ? ' - ' : ''}${matchType}` : ''}
              </div>
              {venue && (
                <div className="mt-1 text-sm text-primary-foreground">
                  {venue}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-1 items-center justify-end gap-4">
              <div className="text-center md:text-right">
                <h3 className="font-bold text-primary-foreground">
                  {awayTeam.name}
                </h3>
                <TeamStats team={awayTeam} />
              </div>
              <TeamLogo team={awayTeam} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
