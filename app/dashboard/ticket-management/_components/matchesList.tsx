'use server';

import { getMatches } from '@/app/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TicketManagement } from './ticket-management';

export async function MatchesList() {
  const { matches, error } = await getMatches();

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-h-[1200px] space-y-4 overflow-y-auto">
      {matches.map((match) => (
        <TicketManagement key={match.match_id} match={match} />
      ))}
    </div>
  );
}
