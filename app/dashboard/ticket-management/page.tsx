'use server';

import { Suspense } from 'react';
import { MatchesList } from './_components/matchesList';
import { LoadingState } from './_components/loading-state';

export default async function TicketsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Ticket Management</h1>
      <Suspense fallback={<LoadingState />}>
        <MatchesList />
      </Suspense>
    </div>
  );
}
