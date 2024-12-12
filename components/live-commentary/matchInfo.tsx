'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MatchData } from '@/types/match';
import Image from 'next/image';

interface MatchInfoProps {
  matchInfo: MatchData;
}

export default function MatchInfoCard({ matchInfo }: MatchInfoProps) {
  const { homeTeam, awayTeam, venue, matchType, round } = matchInfo;

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-primary/90">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative h-16 w-16 rounded-md bg-background">
                <Image
                  src={homeTeam.image_path}
                  alt={homeTeam.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-bold text-primary-foreground">
                  {homeTeam.name}
                </h3>
                <p className="text-sm text-primary-foreground">
                  {homeTeam.wins}W - {homeTeam.losses}L - {homeTeam.draws}D
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 text-center">
              <div className="mb-2 text-2xl font-bold text-primary-foreground">
                VS
              </div>
              <div className="text-sm text-primary-foreground">
                Round {round} - {matchType}
              </div>
              <div className="mt-1 text-sm text-primary-foreground">
                {venue}
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
              <div className="text-center md:text-right">
                <h3 className="font-bold text-primary-foreground">
                  {awayTeam.name}
                </h3>
                <p className="text-sm text-primary-foreground">
                  {awayTeam.wins}W - {awayTeam.losses}L - {awayTeam.draws}D
                </p>
              </div>
              <div className="relative h-16 w-16 rounded-md bg-background">
                <Image
                  src={awayTeam.image_path}
                  alt={awayTeam.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
