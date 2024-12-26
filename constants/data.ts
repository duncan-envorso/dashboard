import { NavItem } from '@/types';
import { Badge } from '@/components/ui/badge';

export interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  verified: boolean;
  status: 'Active' | 'Inactive';
  accessLevel: 'Admin' | 'Editor' | 'Viewer';
  lastActive?: string;
}

export const users: User[] = [
  {
    id: 1,
    name: 'Sarah Williams',
    department: 'Media',
    role: 'Head of Digital Content',
    verified: true,
    status: 'Active',
    accessLevel: 'Admin',
    lastActive: '2024-11-08'
  },
  {
    id: 2,
    name: "James O'Connor",
    department: 'Coaching',
    role: 'Performance Analyst',
    verified: true,
    status: 'Active',
    accessLevel: 'Editor',
    lastActive: '2024-11-08'
  },
  {
    id: 3,
    name: 'Emma Davies',
    department: 'Media',
    role: 'Social Media Manager',
    verified: true,
    status: 'Active',
    accessLevel: 'Editor',
    lastActive: '2024-11-07'
  },
  {
    id: 4,
    name: 'Tom Roberts',
    department: 'Media',
    role: 'Match Day Reporter',
    verified: true,
    status: 'Active',
    accessLevel: 'Editor',
    lastActive: '2024-11-08'
  },
  {
    id: 5,
    name: 'David Hughes',
    department: 'Commercial',
    role: 'Sponsorship Manager',
    verified: true,
    status: 'Active',
    accessLevel: 'Viewer',
    lastActive: '2024-11-06'
  },
  {
    id: 6,
    name: 'Lucy Chen',
    department: 'Media',
    role: 'Video Content Producer',
    verified: true,
    status: 'Active',
    accessLevel: 'Editor',
    lastActive: '2024-11-08'
  },
  {
    id: 7,
    name: 'Mike Thompson',
    department: 'Medical',
    role: 'Team Physio',
    verified: true,
    status: 'Active',
    accessLevel: 'Editor',
    lastActive: '2024-11-07'
  },
  {
    id: 8,
    name: 'Rachel Anderson',
    department: 'Operations',
    role: 'Team Manager',
    verified: true,
    status: 'Active',
    accessLevel: 'Admin',
    lastActive: '2024-11-08'
  },
  {
    id: 9,
    name: 'Ian McMillan',
    department: 'Coaching',
    role: 'Stats Analyst',
    verified: true,
    status: 'Active',
    accessLevel: 'Editor',
    lastActive: '2024-11-08'
  },
  {
    id: 10,
    name: 'Sophie Taylor',
    department: 'Media',
    role: 'Website Administrator',
    verified: true,
    status: 'Active',
    accessLevel: 'Admin',
    lastActive: '2024-11-08'
  },
  {
    id: 11,
    name: 'Ben Wilson',
    department: 'Commercial',
    role: 'Merchandise Manager',
    verified: true,
    status: 'Active',
    accessLevel: 'Viewer',
    lastActive: '2024-11-07'
  },
  {
    id: 12,
    name: 'Gareth Price',
    department: 'Media',
    role: 'Press Officer',
    verified: true,
    status: 'Active',
    accessLevel: 'Editor',
    lastActive: '2024-11-08'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Team Roster',
    href: '/dashboard/team-roster',
    icon: 'profile',
    label: 'profile'
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: 'bell',
    label: 'notifications'
  },
  {
    title: 'News Articles',
    href: '/dashboard/news-articles',
    icon: 'newspaper',
    label: 'Newspaper'
  },
  {
    title: 'Live Commentary',
    href: '/dashboard/live-commentary',
    icon: 'messageSquare',
    label: 'Dashboard',
    badge: 'Coming Soon'
  },
  {
    title: 'Ticket Management',
    href: '/dashboard/ticket-management',
    icon: 'messageSquare',
    label: 'Dashboard'
  },

  {
    title: 'User Management',
    href: '/dashboard/user-management',
    icon: 'settings',
    label: 'settings'
    // badge: 'Coming Soon' // Remove the JSX element and just use a string
  }
];
