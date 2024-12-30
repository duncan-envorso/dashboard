// /components/live-commentary/TeamLineup.tsx
import { Team } from '@/types/match';
import { PlayerCard } from './PlayerCard';

interface TeamLineupProps {
  team: Team;
  isHomeTeam: boolean;
}

export function TeamLineup({ team, isHomeTeam }: TeamLineupProps) {
  const sortedLineup = [...team.lineUp].sort((a, b) => {
    const numA = Number(a.player_number) || 0;
    const numB = Number(b.player_number) || 0;
    return numA - numB;
  });

  return (
    <div className="space-y-2">
      <h3
        className={`text-lg font-bold ${
          isHomeTeam ? 'text-right' : 'text-left'
        }`}
      >
        {team.name} Lineup
      </h3>
      {sortedLineup.map((player) => (
        <PlayerCard
          key={`${player.name}-${player.player_number}`}
          player={player}
          teamName={team.name}
          isHomeTeam={isHomeTeam}
        />
      ))}
    </div>
  );
}
