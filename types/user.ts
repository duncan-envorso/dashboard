// Permissions a user can have
export type Permission =
  | 'Administrator'
  | 'Live Commentary'
  | 'Send Alerts'
  | 'Post Articles'
  | 'Manage Roster'
  | 'Manage Access';

// Simplified User interface based on the provided data structure
export interface User {
  id: string; // UUID format
  email: string;
  permissions: Permission[]; // Array of permissions
}
