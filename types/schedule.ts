export interface Team {
  name: string;
  shortName: string;
  wins: number;
  losses: number;
  draws: number;
  image_path: string;
}

export interface Match {
  venue: string;
  start_time: string;
  round: number;
  name: string;
  match_id: string;
  match_type: string;
  homeTeam: Team;
  awayTeam: Team;
  tickets_url: string;
}

export interface MatchData {
  upcomingMatchesData: Match[];
  pastMatchesData: Match[];
}
