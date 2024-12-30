// /app/live-commentary/page.tsx

import { getMatchData } from '@/app/actions';
import { CommentProvider } from '@/components/live-commentary/comment-provider';
import { DeviceProvider } from '@/components/live-commentary/device-context';
import LiveCommentaryLayout from '@/components/live-commentary/LiveCommentaryLayout';

export default async function LiveCommentaryPage() {
  const matchData = await getMatchData('fcb64700-5989-4228-bee1-09c7e61a8d2c');
  console.log('matchData', matchData, 'matchData');
  return (
    <CommentProvider>
      <DeviceProvider>
        <LiveCommentaryLayout matchData={matchData} />
      </DeviceProvider>
    </CommentProvider>
  );
}
