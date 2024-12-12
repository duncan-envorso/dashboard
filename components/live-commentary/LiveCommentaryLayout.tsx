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
import { MatchData } from '@/types/match';

interface LiveCommentaryLayoutProps {
  matchData: MatchData;
}

export default function LiveCommentaryLayout({
  matchData
}: LiveCommentaryLayoutProps) {
  const { comments, addComment, deleteComment, editComment } = useComments();
  const { deviceType, setDeviceType } = useDevice();

  return (
    <div className="flex h-screen flex-col">
      <CommentaryHeader />
      <MatchInfoCard matchInfo={matchData} />
      <div className="flex-grow overflow-auto">
        <div className="container mx-auto p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-4">
              <TeamLineup team={matchData.homeTeam} isHomeTeam={true} />
            </div>
            <Card>
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
            <div className="space-y-4">
              <TeamLineup team={matchData.awayTeam} isHomeTeam={false} />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto p-4">
          <Commentary onAddComment={addComment} />
        </div>
      </div>
    </div>
  );
}
