'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Commentary from './Commentary';
import DevicePreview from './DevicePreview';
import CommentaryHeader from './Header';
import { initialConfig } from '@/lib/constants';
import { useComments } from './comment-provider';
import { useDevice } from './device-context';
import { TeamLineup } from './TeamLineUp';
import MatchInfoCard from './matchInfo';
import { LiveMatchData } from '@/types/match';

interface LiveCommentaryLayoutProps {
  matchData: LiveMatchData;
}

interface Comment {
  id: string;
  text: string;
  timestamp: string;
  type?: 'try' | 'conversion' | 'penalty' | 'card' | 'substitution' | 'general';
}

export default function LiveCommentaryLayout({
  matchData
}: LiveCommentaryLayoutProps) {
  const { comments, addComment, deleteComment, editComment } = useComments();
  const { deviceType, setDeviceType } = useDevice();

  // Early return if essential data is missing
  if (!matchData.homeTeam || !matchData.awayTeam) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Match data is not available</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header Section */}
      <CommentaryHeader />

      {/* Match Info Section */}
      <MatchInfoCard matchInfo={matchData} />

      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        <div className="container mx-auto p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Home Team Lineup */}
            <div className="space-y-4">
              <TeamLineup team={matchData.homeTeam} isHomeTeam={true} />
            </div>

            {/* Live Feed */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Live Match Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <DevicePreview
                  config={initialConfig}
                  comments={comments}
                  deviceType={deviceType}
                  setDeviceType={setDeviceType}
                  onDeleteComment={deleteComment}
                  onEditComment={editComment}
                />
              </CardContent>
            </Card>

            {/* Away Team Lineup */}
            <div className="space-y-4">
              <TeamLineup team={matchData.awayTeam} isHomeTeam={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Commentary Input Section */}
      <div className="border-t bg-background">
        <div className="container mx-auto p-4">
          <Commentary onAddComment={addComment} />
        </div>
      </div>
    </div>
  );
}

// Export types for reuse in other components
export type { Comment, LiveCommentaryLayoutProps };
