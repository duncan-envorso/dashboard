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
  type: 'Modal' | 'Toast' | 'Image';
  title: string;
  body: string;
  image_url?: string;
  expiration_date: string;
  button_text?: string;
  button_text_color?: string;
  button_background_color?: string;
  text_color: string;
  background_color: string;
  created_at: string;
  created_by: string;
  sending_at?: string;
  expires_at: string;
  delivered?: number;
  clicked?: number;
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
  date: string;
  date_gmt: string;
  featured_image_url: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    _acf_changed: boolean;
    _EventAllDay: boolean;
    _EventTimezone: string;
    _EventStartDate: string;
    _EventEndDate: string;
    [key: string]: any; // For any additional meta fields
  };
}