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
  teamId?: string 
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
  | "Scheduled"
  | "Draft"
  | "Active"
  | "Completed"
  | "Canceled"
  | "Deleted";



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
  dismissed_count?: string
};

export type Notifications = Notification[];



export interface BlogPost {
  featuredImage?: string;
  excerpt?: string;
  slug?: string;
  content?: string;
  id: number;
  title: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
}

export interface NewsPost {
  id: number;
  title: string;
  type: string;
  image: string;
  date_formatted: string;
}

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
  staff: any[]; // Define a more specific type if staff data structure becomes available
}