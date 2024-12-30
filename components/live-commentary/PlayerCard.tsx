// /components/live-commentary/PlayerCard.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useState } from 'react';
import { Player } from '@/types/match';

interface PlayerCardProps {
  player: Player;
  teamName: string;
  isHomeTeam: boolean;
}

export function PlayerCard({ player, teamName, isHomeTeam }: PlayerCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Card
        className={`cursor-pointer bg-primary/90 backdrop-blur-sm transition-colors 
        hover:bg-primary ${isHomeTeam ? 'text-right' : 'text-left'}`}
        onClick={() => setShowDialog(true)}
      >
        <CardContent className="flex items-center gap-2 p-3">
          {!isHomeTeam && (
            <div className="relative h-8 w-8 flex-shrink-0">
              {player.thumbnail && (
                <Image
                  src={player.thumbnail}
                  alt={player.name}
                  fill
                  className="rounded-full object-cover"
                />
              )}
            </div>
          )}
          <div
            className={`flex-grow ${isHomeTeam ? 'text-right' : 'text-left'}`}
          >
            <p className="font-medium text-primary-foreground">
              {player.is_captain && '(C) '}
              {player.name}
            </p>
            <p className="text-sm text-secondary">
              #{player.player_number} - {player.position}
            </p>
          </div>
          {isHomeTeam && (
            <div className="relative h-8 w-8 flex-shrink-0">
              {player.thumbnail && (
                <Image
                  src={player.thumbnail}
                  alt={player.name}
                  fill
                  className="rounded-full object-cover"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {player.is_captain && '(C) '}
              {player.name} - {teamName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative aspect-square">
              {player.portrait && (
                <Image
                  src={player.portrait}
                  alt={player.name}
                  fill
                  className="rounded-lg object-cover"
                />
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Player Info</h3>
                <dl className="space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Number</dt>
                    <dd>{player.player_number}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Position</dt>
                    <dd>{player.position}</dd>
                  </div>
                  {player.height && player.height > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Height</dt>
                      <dd>{player.height}cm</dd>
                    </div>
                  )}
                  {player.weight && player.weight > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Weight</dt>
                      <dd>{player.weight}kg</dd>
                    </div>
                  )}
                  {player.hometown && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Hometown</dt>
                      <dd>{player.hometown}</dd>
                    </div>
                  )}
                  {player.date_of_birth && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date of Birth</dt>
                      <dd>
                        {new Date(player.date_of_birth).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              {player.bio && (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Bio</h3>
                  <div
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: player.bio }}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
