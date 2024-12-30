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
  type: 'Modal' | 'Image' | 'Toast';
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
  image_url?: string; // Align with Notification
  expiration_date?: string; // Align with Notification
  button_text?: string; // Align with Notification
  button_text_color?: string; // Align with Notification
  button_background_color?: string; // Align with Notification
  text_color?: string; // Align with Notification
  background_color?: string; // Align with Notification
  created_at?: string | number | Date; // Align with Notification
  created_by?: string; // Align with Notification
  updated_at?: string | number | Date; // Align with Notification
}

export type ModalSchedulingStatus =
  | 'Scheduled'
  | 'Draft'
  | 'Active'
  | 'Completed'
  | 'Canceled'
  | 'Deleted';

export interface Notification {
  id: string;
  type: 'Modal' | 'Image' | 'Toast';
  title: string;
  body: string;
  image_url: string;
  expiration_date: string;
  button_text: string;
  button_text_color: string;
  button_background_color: string;
  text_color: string;
  background_color: string;
  topic?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  timezone?: string;
  status: ModalSchedulingStatus;
  created_at: string | number | Date;
  created_by: string;
  updated_at: string | number | Date;
}

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

export interface NotificationPayload {
  title: string;
  body: string;
  topic: string;
  key: string;
}
