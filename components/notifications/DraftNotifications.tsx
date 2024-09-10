'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Notification, useNotifications } from '@/app/contexts/NotifcationsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';



const DraftNotifications: React.FC = () => {
  const { notifications, loading, error } = useNotifications();
  const [sortedNotifications, setSortedNotifications] = useState<Notification[]>(notifications);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<keyof Notification>('created_at');

  useEffect(() => {
    const draftNotifications = notifications.filter(notification => notification.status === "Draft");
    const sorted = [...draftNotifications].sort((a, b) => {
        const aValue = a[sortField] ?? ''; // Use empty string if undefined
      const bValue = b[sortField] ?? ''; // Use empty string if undefined
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;

      if (['created_at', 'sending_at', 'expiration_date'].includes(sortField)) {
        const dateA = aValue ? new Date(aValue).getTime() : 0; // Handle undefined
        const dateB = bValue ? new Date(bValue).getTime() : 0; // Handle undefined
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedNotifications(sorted); // Update sorted notifications
  }, [notifications, sortDirection, sortField]);

  const toggleSort = (field: keyof Notification) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
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
        <CardTitle className="text-2xl font-industry font-bold">Draft Notifications</CardTitle>
        <CardDescription className="text-light-grey dark:text-gray-300">View all draft in-app notifications</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader className="mt-2">
            <TableRow className="bg-green/20 mt-2 p-2 rounded dark:bg-green/30">
              {['Title', 'Type', 'Created at', 'Created By', 'Sending at', 'Expires at', 'Delivered', 'Clicked'].map((header) => (
                <TableHead
                  key={header}
                  className="text-navy rounded dark:text-white cursor-pointer"
                  onClick={() => toggleSort(header.toLowerCase().replace(' ', '_') as keyof Notification)}
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
                    {notification.expiration_date
                      ? new Date(notification.expiration_date).toLocaleString()
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

export default DraftNotifications;