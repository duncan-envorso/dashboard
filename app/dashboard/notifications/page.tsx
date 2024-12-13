'use client';

import ModalsTable from '@/components/notifications/ModalsTable';
import NotificationsTable from '@/components/notifications/NotifcationsTable';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6">
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Notifications Dashboard
          </CardTitle>
          <CardDescription>
            Manage and monitor all your notifications in one place
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <div className="w-full">
          <ModalsTable />
        </div>

        <div className="w-full">
          <NotificationsTable />
        </div>
      </div>
    </div>
  );
}
