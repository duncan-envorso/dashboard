'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Match, MatchData } from '@/types/schedule';
import { useToast } from '@/components/ui/use-toast';
import TicketManagement from './_components/ticket-management';
import { useSession } from 'next-auth/react';

export default function TicketsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const session = useSession();

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        'https://api.seawolves.envorso.com/v1/matches'
      );
      if (!response.ok) throw new Error('Failed to fetch matches');

      const data: MatchData = await response.json();
      const sortedMatches = [
        ...data.upcomingMatchesData,
        ...data.pastMatchesData
      ].sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      setMatches(sortedMatches);
    } catch (err) {
      setError('Failed to load matches. Please try again later.');
      toast({
        title: 'Error',
        description: 'Could not load matches',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketUrl = async (matchId: string, ticketsUrl: string) => {
    try {
      const response = await fetch(
        `https://api.seawolves.envorso.com/v1/matches/${matchId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.data?.accessToken}`
          },
          body: JSON.stringify({ ticketsUrl })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update ticket URL');
      }

      setMatches(
        matches.map((match) =>
          match.match_id === matchId ? { ...match, ticketsUrl } : match
        )
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Ticket Management</h1>
      <div className="max-h-[1200px] space-y-4 overflow-y-auto">
        {matches.map((match) => (
          <TicketManagement
            key={match.match_id}
            match={match}
            onUpdate={updateTicketUrl}
          />
        ))}
      </div>
    </div>
  );
}
