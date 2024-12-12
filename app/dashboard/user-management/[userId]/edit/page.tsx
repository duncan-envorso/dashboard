// app/dashboard/users/[userId]/edit/page.tsx
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserForm } from '@/components/forms/user-form';

import PageContainer from '@/components/layout/page-container';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Users', link: '/dashboard/users' },
  { title: 'Edit', link: '#' }
];

export default async function Page() {
  // Convert the ID to match your data type (if using number IDs)

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <UserForm />
      </div>
    </PageContainer>
  );
}
