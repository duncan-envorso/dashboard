export interface Player {
    id: string;
    name: string;
    position: string;
    position_group_id: number | null;
    height: number;
    weight: number;
    portrait: string;
    thumbnail: string;
}

export interface Coach {
    id: number;
    name: string;
    job_title: string;
    portrait: string;
}

export interface TeamData {
    players: Player[];
    coaches: Coach[];
    staff: any[]; // Assuming staff is empty based on the provided data
}

export const positionGroups = {
    "1": "Forward",
    "2": "Back",
    "3": "Specialist",
    "4": "Staff"
}

type Team = {
  name: string;
  shortName: string;
  wins: number;
  losses: number;
  draws: number;
  image_path: string;
};

type Match = {
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

type MatchesData = {
  upcomingMatchesData: Match[];
  pastMatchesData: Match[];
};
