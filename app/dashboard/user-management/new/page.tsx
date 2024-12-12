// app/dashboard/users/new/page.tsx
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserForm } from '@/components/forms/user-form';
import PageContainer from '@/components/layout/page-container';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Users', link: '/dashboard/users' },
  { title: 'New User', link: '#' }
];

export default function NewUserForm() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <UserForm />
      </div>
    </PageContainer>
  );
}
