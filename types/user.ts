// types/user.ts

// Basic user information
export type UserStatus = 'Active' | 'Inactive';
export type AccessLevel = 'Admin' | 'Editor' | 'Viewer';

export type Department = 'media' | 'coaching' | 'medical' | 'commercial' | 'operations';

// Role definitions by department
export type MediaRole = 
  | 'Head of Digital Content'
  | 'Social Media Manager'
  | 'Video Content Producer'
  | 'Match Day Reporter'
  | 'Press Officer';

export type CoachingRole = 
  | 'Performance Analyst'
  | 'Stats Analyst'
  | 'Video Analyst';

export type MedicalRole = 
  | 'Team Doctor'
  | 'Head Physio'
  | 'Team Physio';

export type CommercialRole = 
  | 'Sponsorship Manager'
  | 'Merchandise Manager'
  | 'Marketing Manager';

export type OperationsRole = 
  | 'Team Manager'
  | 'Operations Manager'
  | 'Website Administrator';

export type UserRole = 
  | MediaRole 
  | CoachingRole 
  | MedicalRole 
  | CommercialRole 
  | OperationsRole;

// Department information
export interface DepartmentInfo {
  id: Department;
  name: string;
}

// Role mapping structure
export type DepartmentRoles = {
  [K in Department]: string[];
};

// User avatar/profile photo
export interface UserAvatar {
  fileName: string;
  fileUrl: string;
}

// Permission structure
export type Permission = 
  | 'create_posts'
  | 'edit_posts'
  | 'delete_posts'
  | 'manage_users'
  | 'view_analytics'
  | 'manage_team'
  | 'edit_player_profiles'
  | 'manage_media'
  | 'publish_content'
  | 'moderate_comments';

// Base interface for common table operations
export interface BaseRecord {
  id: number;  // Changed to required number for DataTable compatibility
}

// User base interface
export interface UserBase extends BaseRecord {  // Extend from BaseRecord
  name: string;
  email: string;
  department: Department;
  role: UserRole;
  accessLevel: AccessLevel;
  status: UserStatus;
  verified: boolean;
  avatar?: UserAvatar;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Full user interface including permissions
export interface User extends UserBase {
  permissions: Permission[];
}

// Form specific interface - note that id is optional here for creation forms
export interface UserFormData extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastActive'> {
  id?: number;  // Optional for creation, required for updates
  sendWelcomeEmail: boolean;
}

// Response type for API calls
export interface UserResponse extends User {
  id: number;  // Always required in responses
}

export interface UserStats {
  total: number;
  active: number;
  verified: number;
  departments: {
    media: number;
    coaching: number;
    medical: number;
    commercial: number;
    operations: number;
  };
}

// Department configuration
export const DEPARTMENTS: DepartmentInfo[] = [
  { id: 'media', name: 'Media' },
  { id: 'coaching', name: 'Coaching' },
  { id: 'medical', name: 'Medical' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'operations', name: 'Operations' },
];

// Role configuration
export const DEPARTMENT_ROLES: DepartmentRoles = {
  media: [
    'Head of Digital Content',
    'Social Media Manager',
    'Video Content Producer',
    'Match Day Reporter',
    'Press Officer',
  ],
  coaching: [
    'Performance Analyst',
    'Stats Analyst',
    'Video Analyst',
  ],
  medical: [
    'Team Doctor',
    'Head Physio',
    'Team Physio',
  ],
  commercial: [
    'Sponsorship Manager',
    'Merchandise Manager',
    'Marketing Manager',
  ],
  operations: [
    'Team Manager',
    'Operations Manager',
    'Website Administrator',
  ],
};

// Default permissions by access level
export const DEFAULT_PERMISSIONS: Record<AccessLevel, Permission[]> = {
  Admin: [
    'create_posts',
    'edit_posts',
    'delete_posts',
    'manage_users',
    'view_analytics',
    'manage_team',
    'edit_player_profiles',
    'manage_media',
    'publish_content',
    'moderate_comments',
  ],
  Editor: [
    'create_posts',
    'edit_posts',
    'view_analytics',
    'edit_player_profiles',
    'publish_content',
    'moderate_comments',
  ],
  Viewer: [
    'view_analytics',
  ],
};

// Helper function to get roles for a department
export const getRolesForDepartment = (department: Department): string[] => {
  return DEPARTMENT_ROLES[department] || [];
};

// Helper function to get default permissions for an access level
export const getDefaultPermissions = (accessLevel: AccessLevel): Permission[] => {
  return DEFAULT_PERMISSIONS[accessLevel] || [];
};

// Form default values
export const DEFAULT_USER_FORM_VALUES: UserFormData = {
  name: '',
  email: '',
  department: 'media',
  role: 'Match Day Reporter',
  accessLevel: 'Viewer',
  status: 'Active',
  verified: false,
  permissions: [],
  sendWelcomeEmail: true,
};

// Type guard to check if a user object is valid
export function isValidUser(user: any): user is User {
  return (
    typeof user === 'object' &&
    typeof user.id === 'number' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof user.department === 'string' &&
    typeof user.role === 'string' &&
    typeof user.accessLevel === 'string' &&
    typeof user.status === 'string' &&
    typeof user.verified === 'boolean' &&
    Array.isArray(user.permissions)
  );
}