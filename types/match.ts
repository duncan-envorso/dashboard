export interface Player {
  name: string;
  position: string;
  height: number;
  weight: number;
  hometown: string;
  date_of_birth: string | null;
  bio: string | null;
  portrait: string | null;
  thumbnail: string;
  player_number: number;
  is_captain: boolean;
}

export interface Team {
  id: string;
  name: string;
  image_path: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  matches_played: number;
  shortName: string;
  lineUp: Player[];
}

export interface Referee {
  name: string;
  type: string;
}

export interface MatchStatistics {
  match_id: string;
  team_id: string;
  tries: number;
  penalty_tries: number;
  attempted_conversions: number;
  successful_conversions: number;
  attempted_penalty_goal_kicks: number;
  successful_penalty_goal_kicks: number;
  attempted_drop_goals: number;
  successful_drop_goals: number;
  passes: number;
  yellow_cards: number;
  red_cards: number;
  penalties_conceded: number;
  ball_carries: number;
  tackles: number;
  breakdowns: number;
  lineouts: number;
  scrums: number;
  restarts: number;
  match_id_team_id: string;
}

export interface LastMatchData {
  home_score: number;
  away_score: number;
  statistics: {
    homeTeam: MatchStatistics[];
    awayTeam: MatchStatistics[];
  };
}

export interface PastMatch {
  id: string;
  venue: string;
  start_time: string;
  in_progress: boolean;
  round: number;
  name: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
}

export interface MatchData {
  homeTeam: Team;
  awayTeam: Team;
  referees: Referee[];
  venue: string;
  start_time: string;
  round: number;
  name: string;
  matchType: string;
  lastMatchData: LastMatchData;
  pastMatches: PastMatch[];
}
