import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  badge?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface MessageConfig {
  id: string;
  teamId?: string;
  modalType: 'Modal' | 'Image' | 'Toast';
  textColor: string;
  title: string;
  body: string;
  imageUrl: string;
  buttonText: string;
  buttonBackground: string;
  buttonTextColor: string;
  topic?: string;
  expirationDate?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  timezone?: string;
  status: ModalSchedulingStatus;
  createdAt: string | number | Date;
  createdBy: string;
  updatedAt: string | number | Date;
}

export type ModalSchedulingStatus =
  | 'Scheduled'
  | 'Draft'
  | 'Active'
  | 'Completed'
  | 'Canceled'
  | 'Deleted';

export type Notification = {
  status: string;
  id: string;

  type: 'Modal' | 'Toast' | 'Image';
  title: string;
  body: string;
  image_url?: string;
  button_text?: string;
  button_text_color?: string;
  button_background_color?: string;
  text_color: string;
  background_color: string;
  created_at: string;
  created_by: string;
  sending_at?: string;
  expires_at: string;
  viewed_count?: string;
  clicked_count?: string;
  dismissed_count?: string;
};

export type Notifications = Notification[];

export interface Coach {
  id: number;
  name: string;
  job_title: string;
  portrait: string;
}

export interface Comment {
  id: number;
  text: string;
  isLiveFeed: boolean;
  timestamp?: number;
}

export interface MessageConfig {
  title: string;
  imageUrl: string;
  buttonText: string;
  textColor: string;
  buttonBackground: string;
  buttonTextColor: string;
}

export interface Referee {
  name: string;
  type: string;
}

export interface MatchStatistics {
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
