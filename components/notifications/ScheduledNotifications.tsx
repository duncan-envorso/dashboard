'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useNotifications } from '@/app/contexts/NotifcationsContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { Notification, MessageConfig } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import NotificationConfig from './ModalComponent';

export default function ScheduledNotifications() {
  const { notifications, loading, error, updateNotification } =
    useNotifications();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);

  const scheduledNotifications = React.useMemo(
    () =>
      notifications.filter(
        (notification) => notification.status === 'Scheduled'
      ),
    [notifications]
  );

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedConfig: MessageConfig) => {
    if (!editingNotification) return;

    try {
      await updateNotification(editingNotification.id, updatedConfig);
      toast({
        title: 'Success',
        description: 'Notification has been updated.'
      });
      setIsEditModalOpen(false);
      setEditingNotification(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update notification. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => row.getValue('title') || 'N/A'
    },
    {
      accessorKey: 'modal_type',
      header: 'Type'
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      cell: ({ row }) => (
        <span suppressHydrationWarning>
          {new Date(row.getValue('created_at')).toLocaleString()}
        </span>
      )
    },
    {
      accessorKey: 'expires_at',
      header: 'Expires at',
      cell: ({ row }) => (
        <span suppressHydrationWarning>
          {row.getValue('expires_at')
            ? new Date(row.getValue('expires_at')).toLocaleString()
            : 'N/A'}
        </span>
      )
    },
    {
      accessorKey: 'viewed_count',
      header: 'Viewed',
      cell: ({ row }) => row.getValue('viewed_count') || '-'
    },
    {
      accessorKey: 'clicked_count',
      header: 'Clicked',
      cell: ({ row }) => row.getValue('clicked_count') || '-'
    },
    {
      accessorKey: 'dismissed_count',
      header: 'Dismissed',
      cell: ({ row }) => row.getValue('dismissed_count') || '-'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(notification)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        );
      }
    }
  ];

  const table = useReactTable({
    data: scheduledNotifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="m-5 overflow-hidden bg-white shadow-sm">
      <CardHeader className="bg-primary/30 text-secondary backdrop:blur-xl">
        <CardTitle className="font-industry text-2xl font-bold">
          Scheduled Modals
        </CardTitle>
        <CardDescription className="text-secondary/80">
          View and edit scheduled in-app notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="mt-2 rounded p-2 dark:bg-secondary/30"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer rounded text-foreground"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() &&
                      (header.column.getIsSorted() === 'asc' ? (
                        <ChevronUp className="ml-1 inline" />
                      ) : (
                        <ChevronDown className="ml-1 inline" />
                      ))}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="rounded hover:bg-secondary/10 dark:hover:bg-secondary/20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No scheduled notifications.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          {editingNotification && (
            <NotificationConfig
              config={editingNotification as unknown as MessageConfig}
              onSave={handleSave}
              onNotificationSent={() => {}} // This can be implemented if needed
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
