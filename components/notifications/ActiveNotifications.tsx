import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Notification, useNotifications } from '@/app/contexts/NotifcationsContext';

type SortableField = 'created_at' | 'sending_at' | 'expires_at' | 'title' | 'modal_type' | 'created_by' | 'delivered' | 'clicked';

const ActiveNotifications: React.FC = () => {
  const { notifications, loading, error } = useNotifications();
  const [sortedNotifications, setSortedNotifications] = useState<Notification[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<SortableField>('created_at');

  useEffect(() => {
    const activeNotifications = notifications.filter((notification) => notification.status === "Active");
    const sorted = [...activeNotifications].sort((a, b) => {
      if (['created_at', 'sending_at', 'expires_at'].includes(sortField)) {
        const dateA = new Date(a[sortField as keyof Notification] as string).getTime();
        const dateB = new Date(b[sortField as keyof Notification] as string).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      const valueA = a[sortField as keyof Notification] as string | number;
      const valueB = b[sortField as keyof Notification] as string | number;
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedNotifications(sorted);
  }, [notifications, sortDirection, sortField]);

  const toggleSort = (field: SortableField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="m-5 border-l-4 border-l-green shadow-md dark:bg-navy-light overflow-hidden">
      <CardHeader className="bg-navy dark:bg-navy-dark text-white">
        <CardTitle className="text-2xl font-industry font-bold">Active Notifications</CardTitle>
        <CardDescription className="text-light-grey dark:text-gray-300">View all active in-app notifications</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader className="mt-2">
            <TableRow className="bg-green/20 mt-2 p-2 rounded dark:bg-green/30">
              {['Title', 'Type', 'Created at', 'Created By', 'Sending at', 'Expires at', 'Delivered', 'Clicked'].map((header) => (
                <TableHead
                  key={header}
                  className="text-navy rounded dark:text-white cursor-pointer"
                  onClick={() => toggleSort(header.toLowerCase().replace(' ', '_') as SortableField)}
                >
                  {header}
                  {sortField === header.toLowerCase().replace(' ', '_') &&
                    (sortDirection === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedNotifications.map((notification) => (
              <TableRow key={notification.id} className="hover:bg-green/10 rounded dark:hover:bg-green/20">
                <TableCell className="dark:text-white">{notification.title || 'N/A'}</TableCell>
                <TableCell className="dark:text-white">{notification.modal_type}</TableCell>
                <TableCell className="dark:text-white">
                  <span suppressHydrationWarning>
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="dark:text-white">{notification.created_by || 'N/A'}</TableCell>
                <TableCell className="dark:text-white">
                  <span suppressHydrationWarning>
                    {notification.sending_at ? new Date(notification.sending_at).toLocaleString() : 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="dark:text-white">
                  <span suppressHydrationWarning>
                    {notification.expires_at
                      ? new Date(notification.expires_at).toLocaleString()
                      : 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="dark:text-white">
                  {typeof notification.delivered === 'number' ? notification.delivered : 'N/A'}
                </TableCell>
                <TableCell className="dark:text-white">
                  {typeof notification.clicked === 'number' ? notification.clicked : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActiveNotifications;