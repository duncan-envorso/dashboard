export type Team = {
    name: string;
    shortName: string;
    wins: number;
    losses: number;
    draws: number;
    image_path: string;
  };
  
  export type Match = {
    venue: string;
    start_time: string; // Date as string in ISO format
    round: number;
    name: string;
    match_id: string;
    match_type: string;
    home_score: number;
    away_score: number;
    homeTeam: Team;
    awayTeam: Team;
  };
  
  export type MatchesData = {
    upcomingMatchesData: Match[];
    pastMatchesData: Match[];
  };
  