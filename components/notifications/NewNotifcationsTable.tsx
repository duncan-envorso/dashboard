import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotifcationWithStatus } from '@/types';

interface NotificationsCardProps {
  notifications: NotifcationWithStatus[];
  handleEdit: (notification: NotifcationWithStatus) => void;
  handleSend: (notification: NotifcationWithStatus, index: number) => void;
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications, handleEdit, handleSend }) => {
  return (
    <Card className="m-5 border-l-4 border-l-green shadow-md dark:bg-navy-light overflow-hidden">
      <CardHeader className="bg-navy dark:bg-navy-dark text-white">
        <CardTitle className="text-2xl font-industry font-bold">In-App Notifications</CardTitle>
        <CardDescription className="text-light-grey dark:text-gray-300">Create and manage in-app notifications</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <Table>
          <TableHeader className="mt-2">
            <TableRow className="bg-green/20 mt-2 p-2 rounded dark:bg-green/30">
              <TableHead className="text-navy rounded dark:text-white">Title</TableHead>
              <TableHead className="text-navy dark:text-white">Layout</TableHead>
              <TableHead className="text-navy dark:text-white">Send Date</TableHead>
              <TableHead className="text-navy dark:text-white">Status</TableHead>
              <TableHead className="text-navy dark:text-white">Created By</TableHead>
              <TableHead className="text-navy dark:text-white">Created At</TableHead>
              <TableHead className="text-navy dark:text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification, index) => (
              <TableRow key={index} className="hover:bg-green/10 rounded dark:hover:bg-green/20">
                <TableCell className="dark:text-white">{notification.title}</TableCell>
                <TableCell className="dark:text-white">{notification.modalType}</TableCell>
                <TableCell className="dark:text-white">
                  {notification.expirationDate ?
                    <span suppressHydrationWarning>
                      {new Date(notification.expirationDate).toLocaleString()}
                    </span>
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    notification.status === 'active' ? 'bg-green text-white' :
                    notification.status === 'draft' ? 'bg-light-grey text-navy dark:bg-gray-600 dark:text-white' :
                    notification.status === 'failed' ? 'bg-red-500 text-white' :
                    'bg-grey text-white'
                  }`}>
                    {notification.status}
                  </span>
                </TableCell>
                <TableCell className="dark:text-white">{notification.createdBy}</TableCell>
                <TableCell className="dark:text-white">
                  <span suppressHydrationWarning>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(notification)} variant="outline" className="mr-2 border-navy text-navy hover:bg-navy hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-navy">
                    Edit
                  </Button>
                  <Button onClick={() => handleSend(notification, index)} variant="default" className="bg-green text-white hover:bg-green-dark">
                    Send Now
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;