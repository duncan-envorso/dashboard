// app/dashboard/users/page.tsx
import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { UserClient } from '@/components/tables/user-tables/client';
import { Skeleton } from '@/components/ui/skeleton';
import { getUsers, getUserStats } from '@/app/utils/userData';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Users', link: '/dashboard/users' }
];

async function UsersPage() {
  // Fetch data
  const users = await getUsers();
  const stats = await getUserStats();

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <UserClient data={users} stats={stats} />
      </div>
    </PageContainer>
  );
}

// Loading state component
function LoadingState() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="space-y-4">
          {/* Stats cards loading state */}
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-32 w-full rounded-lg"
              />
            ))}
          </div>
          {/* Table loading state */}
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </PageContainer>
  );
}

// Export the default page component with Suspense
export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <UsersPage />
    </Suspense>
  );
}