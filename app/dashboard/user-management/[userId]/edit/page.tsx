// app/dashboard/user-management/[userId]/edit/page.tsx
import { getServerSession } from 'next-auth';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserForm } from '@/components/forms/user-form';
import PageContainer from '@/components/layout/page-container';
import { redirect } from 'next/navigation';
import authConfig from '@/auth.config';

// Define the Permission type to match what's coming from the API
export type Permission =
  | 'Administrator'
  | 'Live Commentary'
  | 'Send Alerts'
  | 'Post Articles'
  | 'Manage Roster'
  | 'Manage Access';

interface User {
  id: string;
  email: string;
  permissions: Permission[];
}

interface ApiResponse {
  users: {
    id: string;
    email: string;
    permissions: string[];
  }[];
}

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User Management', link: '/dashboard/user-management' },
  { title: 'Edit', link: '#' }
];

function isValidPermission(permission: string): permission is Permission {
  const validPermissions: Permission[] = [
    'Administrator',
    'Live Commentary',
    'Send Alerts',
    'Post Articles',
    'Manage Roster',
    'Manage Access'
  ];
  return validPermissions.includes(permission as Permission);
}

async function getUser(userId: string): Promise<User | null> {
  try {
    const session = await getServerSession(authConfig);
    const token = session?.user?.token;
    if (!token) {
      throw new Error('No authentication token available');
    }

    const API_URL = process.env.NEXT_API_URL;
    const TEAM_ID = session.user.teamId;

    const response = await fetch(`${API_URL}/teams/${TEAM_ID}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    if (!data.users || !Array.isArray(data.users)) {
      throw new Error('Invalid API response format');
    }

    const apiUser = data.users.find((u) => u.id === userId);
    if (!apiUser) {
      return null;
    }

    const validPermissions = apiUser.permissions.filter(isValidPermission);
    return {
      id: apiUser.id,
      email: apiUser.email,
      permissions: validPermissions
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function UserEditPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const user = await getUser(params.userId);

  if (!user) {
    redirect('/dashboard/user-management');
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <UserForm
          userId={params.userId}
          initialData={{
            email: user.email,
            permissions: user.permissions
          }}
        />
      </div>
    </PageContainer>
  );
}
