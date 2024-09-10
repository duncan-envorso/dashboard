import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
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
  teamId: string;
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
    id: string;
    type: 'Modal' | 'Toast' | 'Image'; // Assuming these are the possible types
    title: string;
    body: string;
    image_url?: string; // Optional, as it's only applicable for certain types
    expiration_date: string; // ISO 8601 date-time string
    button_text?: string; // Optional, as it's only for Modal type
    button_text_color?: string; // Optional, as it's only for Modal type
    button_background_color?: string; // Optional, as it's only for Modal type
    text_color: string;
    background_color: string;
    created_at: string; // ISO 8601 date-time string
    created_by: string;
    sending_at?: string; // ISO 8601 date-time string, optional
    expires_at: string; // ISO 8601 date-time string
    delivered?: number; // Optional, as it might not be available for all notifications
    clicked?: number; // Optional, as it might not be available for all notifications
  };
  
  // If you need an array type:
  export type Notifications = Notification[];

