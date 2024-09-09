import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNotifications } from '@/app/contexts/NotifcationsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';

const SentNotificationsTable: React.FC = () => {
  const { notifications, loading, error } = useNotifications();
  const [sortedNotifications, setSortedNotifications] = useState(notifications);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const sorted = [...notifications].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setSortedNotifications(sorted);
  }, [notifications, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="m-5 border-l-4 border-l-green shadow-md dark:bg-navy-light overflow-hidden">
      <CardHeader className="bg-navy dark:bg-navy-dark text-white">
        <CardTitle className="text-2xl font-industry font-bold">Sent Notifications</CardTitle>
        <CardDescription className="text-light-grey dark:text-gray-300">View all sent in-app notifications</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <Table>
          <TableHeader className="mt-2">
            <TableRow className="bg-green/20 mt-2 p-2 rounded dark:bg-green/30">
              <TableHead className="text-navy rounded dark:text-white">Title</TableHead>
              <TableHead className="text-navy dark:text-white">Type</TableHead>
              <TableHead className="text-navy dark:text-white">Expiration Date</TableHead>
              <TableHead 
                className="text-navy dark:text-white cursor-pointer"
                onClick={toggleSortDirection}
              >
                Created At
                {sortDirection === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />}
              </TableHead>
              <TableHead className="text-navy dark:text-white">Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedNotifications.map((notification) => (
              <TableRow key={notification.id} className="hover:bg-green/10 rounded dark:hover:bg-green/20">
                <TableCell className="dark:text-white">{notification.title || 'N/A'}</TableCell>
                <TableCell className="dark:text-white">{notification.modal_type}</TableCell>
                <TableCell className="dark:text-white">
                  <span suppressHydrationWarning>
                    {new Date(notification.expiration_date).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="dark:text-white">
                  <span suppressHydrationWarning>
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="dark:text-white">
                  <span suppressHydrationWarning>
                    {new Date(notification.updated_at).toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SentNotificationsTable;