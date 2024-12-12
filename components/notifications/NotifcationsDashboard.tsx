import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import NotificationsTable from './NotifcationsTable';
import ModalsTable from './ModalsTable';

export default function NotificationDashboard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notifications and Modals</CardTitle>
        <CardDescription>
          View and manage your notifications and modals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <ModalsTable />
        </div>
        <div className="mt-10">
          <NotificationsTable />
        </div>
      </CardContent>
    </Card>
  );
}
