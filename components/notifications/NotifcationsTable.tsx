'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment-timezone';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface Notification {
  id: string;
  title: string;
  modal_type: string;
  created_at: string;
  expires_at?: string;
  status: string;
  viewed_count: number;
  clicked_count: number;
  dismissed_count: number;
}

const mockNotifications = [
  {
    id: '1',
    title: 'Important Team Update',
    modal_type: 'miscellaneous',
    created_at: '2024-03-15T10:00:00Z',
    body: 'Please check your email for important updates about the team schedule',
    topic: 'miscellaneous',
    teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
    expires_at: '2024-04-15T10:00:00Z',
    status: 'Active',
    viewed_count: 1250,
    clicked_count: 856,
    dismissed_count: 94
  },
  {
    id: '2',
    title: 'Game Day Information',
    modal_type: 'Alert',
    created_at: '2024-03-14T15:30:00Z',
    body: 'Important information about upcoming game day logistics',
    topic: 'gameday',
    teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
    expires_at: '2024-12-31T23:59:59Z',
    status: 'Scheduled',
    viewed_count: 0,
    clicked_count: 0,
    dismissed_count: 0
  },
  {
    id: '3',
    title: 'Training Schedule Change',
    modal_type: 'Info',
    created_at: '2024-03-13T08:00:00Z',
    body: 'Training schedule has been updated for next week',
    topic: 'training',
    teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
    expires_at: '2024-03-20T08:00:00Z',
    status: 'Active',
    viewed_count: 3420,
    clicked_count: 2891,
    dismissed_count: 129
  }
];

export default function NotificationsTable() {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Draft: 'bg-gray-200 text-gray-800',
      Scheduled: 'bg-blue-100 text-blue-800',
      Active: 'bg-green-100 text-green-800',
      Completed: 'bg-purple-100 text-purple-800',
      Canceled: 'bg-red-100 text-red-800',
      Deleted: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge
        className={
          statusStyles[status as keyof typeof statusStyles] ||
          'bg-gray-200 text-gray-800'
        }
      >
        {status === 'Scheduled' && <Clock className="mr-1 h-3 w-3" />}
        {status}
      </Badge>
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <Card className="rounded-lg bg-white">
      <CardHeader className="rounded-t-md bg-primary/90 text-secondary backdrop:blur-xl">
        <CardTitle className="font-industry text-2xl font-bold">
          Notifications
        </CardTitle>
        <CardDescription className="text-primary-foreground/90">
          View all in-app notifications
        </CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Expires at</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Viewed</TableHead>
            <TableHead>Clicked</TableHead>
            <TableHead>Dismissed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((notification) => (
            <TableRow
              key={notification.id}
              className="rounded hover:bg-secondary/10"
            >
              <TableCell className="font-medium">
                {notification.title}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{notification.modal_type}</Badge>
              </TableCell>
              <TableCell suppressHydrationWarning>
                {moment(notification.created_at).format('MMM D, YYYY h:mm A')}
              </TableCell>
              <TableCell suppressHydrationWarning>
                {notification.expires_at
                  ? moment(notification.expires_at).format('MMM D, YYYY h:mm A')
                  : 'N/A'}
              </TableCell>
              <TableCell>{getStatusBadge(notification.status)}</TableCell>
              <TableCell>{notification.viewed_count}</TableCell>
              <TableCell>{notification.clicked_count}</TableCell>
              <TableCell>{notification.dismissed_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
