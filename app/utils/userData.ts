// types/mocks/users.ts

import { User, UserStats, Department } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Sarah Williams",
    email: "s.williams@teamrugby.com",
    department: "media",
    role: "Head of Digital Content",
    accessLevel: "Admin",
    status: "Active",
    verified: true,
    permissions: [
      'create_posts',
      'edit_posts',
      'delete_posts',
      'manage_users',
      'view_analytics',
      'manage_media',
      'publish_content',
      'moderate_comments'
    ],
    avatar: {
      fileName: "sarah_profile.jpg",
      fileUrl: "/avatars/sarah_profile.jpg"
    },
    lastActive: "2024-11-08T09:45:23Z",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-11-08T09:45:23Z"
  },
  {
    id: 2,
    name: "James O'Connor",
    email: "j.oconnor@teamrugby.com",
    department: "coaching",
    role: "Performance Analyst",
    accessLevel: "Editor",
    status: "Active",
    verified: true,
    permissions: [
      'create_posts',
      'edit_posts',
      'view_analytics',
      'edit_player_profiles'
    ],
    lastActive: "2024-11-08T10:15:00Z",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-11-08T10:15:00Z"
  },
  // ... continue with other users, changing string IDs to numbers 3-10
];

// Helper functions with proper typing
export async function getUserById(id: number): Promise<User | undefined> {
  return mockUsers.find(user => user.id === id);
}

export const getUsersByDepartment = (department: Department): User[] => {
  return mockUsers.filter(user => user.department === department);
};

export const getUsersByAccessLevel = (accessLevel: User['accessLevel']): User[] => {
  return mockUsers.filter(user => user.accessLevel === accessLevel);
};

export const getActiveUsers = (): User[] => {
  return mockUsers.filter(user => user.status === "Active");
};

export const getUsersByRole = (role: User['role']): User[] => {
  return mockUsers.filter(user => user.role === role);
};

// Analytics helpers with proper return type
export async function getUserStats(): Promise<UserStats> {
  const total = mockUsers.length;
  const active = mockUsers.filter(user => user.status === "Active").length;
  const verified = mockUsers.filter(user => user.verified).length;
  
  const departments = {
    media: mockUsers.filter(user => user.department === "media").length,
    coaching: mockUsers.filter(user => user.department === "coaching").length,
    medical: mockUsers.filter(user => user.department === "medical").length,
    commercial: mockUsers.filter(user => user.department === "commercial").length,
    operations: mockUsers.filter(user => user.department === "operations").length,
  };

  return {
    total,
    active,
    verified,
    departments
  };
}

export async function getUsers(): Promise<User[]> {
  return mockUsers;
}

// Type guard helper for runtime validation
export function isValidUserId(id: unknown): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0;
}

// Helper to convert string ID to number safely
export function parseUserId(id: string): number {
  const numId = parseInt(id, 10);
  if (!isValidUserId(numId)) {
    throw new Error('Invalid user ID');
  }
  return numId;
}

// // Helper for sorting users
// export const sortUsers = (users: User[], key: keyof User, ascending = true): User[] => {
//   return [...users].sort((a, b) => {
//     const aVal = a[key];
//     const bVal = b[key];
//     if (aVal < bVal) return ascending ? -1 : 1;
//     if (aVal > bVal) return ascending ? 1 : -1;
//     return 0;
//   });
// };