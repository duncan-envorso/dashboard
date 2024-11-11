// app/dashboard/users/[userId]/edit/page.tsx
import { getUserById } from '@/app/utils/userData';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserForm } from '@/components/forms/product-form';

import PageContainer from '@/components/layout/page-container';

import { User } from '@/types/user';

interface PageProps {
  params: {
    userId: string;
  };
}

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Users', link: '/dashboard/users' },
  { title: 'Edit', link: '#' }
];

export default async function Page({ params }: PageProps) {
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