export interface Player {
  name: string;
  position?: string;
  height?: number;
  weight?: number;
  hometown?: string;
  date_of_birth?: string | null;
  bio?: string | null;
  portrait?: string | null;
  thumbnail?: string;
  player_number?: number;
  is_captain?: boolean;
  // Additional optional fields
  isStarting?: boolean;
  status?: 'active' | 'injured' | 'suspended';
  nationality?: string;
  appearances?: number;
  teamHistory?: string[];
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
  // Additional optional fields
  founded?: string;
  homeVenue?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  standings?: {
    position?: number;
    pointsDifference?: number;
    triesScored?: number;
  };
}

export interface Referee {
  name: string;
  type: string;
  // Additional optional fields
  experience?: number;
  nationality?: string;
  matches_officiated?: number;
  specialization?: string;
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
  // Additional optional fields
  possession_percentage?: number;
  territory_percentage?: number;
  meters_gained?: number;
  clean_breaks?: number;
  defenders_beaten?: number;
  offloads?: number;
  rucks_won?: number;
  mauls_won?: number;
  turnovers_won?: number;
  tackle_success_rate?: number;
}

export interface LastMatchData {
  home_score: number;
  away_score: number;
  statistics: {
    homeTeam: MatchStatistics[];
    awayTeam: MatchStatistics[];
  };
  // Additional optional fields
  match_summary?: string;
  highlights_url?: string;
  key_moments?: Array<{
    time: string;
    description: string;
    type: 'try' | 'conversion' | 'penalty' | 'card' | 'other';
  }>;
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
  // Additional optional fields
  attendance?: number;
  weather_conditions?: string;
  match_duration?: number;
  broadcast_partner?: string;
  highlights_available?: boolean;
}

export interface LiveMatchData {
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
  // Additional optional fields
  status?:
    | 'scheduled'
    | 'in_progress'
    | 'completed'
    | 'postponed'
    | 'cancelled';
  ticketing?: {
    url?: string;
    available?: boolean;
    price_range?: string;
  };
  broadcast?: {
    tv_partners?: string[];
    streaming_url?: string;
    commentary_team?: string[];
  };
  weather_forecast?: {
    temperature?: number;
    conditions?: string;
    wind_speed?: number;
    precipitation_chance?: number;
  };
}

// Utility types for specific use cases
export type MatchStatus =
  | 'upcoming'
  | 'in_progress'
  | 'completed'
  | 'postponed'
  | 'cancelled';

export interface MatchSummary
  extends Pick<LiveMatchData, 'venue' | 'start_time' | 'round' | 'name'> {
  id: string;
  status: MatchStatus;
  homeTeam: Pick<Team, 'id' | 'name' | 'image_path' | 'shortName'>;
  awayTeam: Pick<Team, 'id' | 'name' | 'image_path' | 'shortName'>;
  score?: {
    home: number;
    away: number;
  };
}
