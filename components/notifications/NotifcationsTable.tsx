'use client';

import React from 'react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import moment from 'moment-timezone';

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

const statusStyles = {
  Draft: 'bg-gray-200 text-gray-800',
  Scheduled: 'bg-blue-100 text-blue-800',
  Active: 'bg-green-100 text-green-800',
  Completed: 'bg-purple-100 text-purple-800',
  Canceled: 'bg-red-100 text-red-800',
  Deleted: 'bg-gray-100 text-gray-800'
};

export default function NotificationsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  });

  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('title')}</span>
      )
    },
    {
      accessorKey: 'modal_type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('modal_type')}</Badge>
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      cell: ({ row }) => (
        <span suppressHydrationWarning>
          {moment(row.getValue('created_at')).format('MMM D, YYYY h:mm A')}
        </span>
      )
    },
    {
      accessorKey: 'expires_at',
      header: 'Expires at',
      cell: ({ row }) => {
        const expiresAt = row.getValue('expires_at');
        return (
          <span suppressHydrationWarning>
            {expiresAt ? moment(expiresAt).format('MMM D, YYYY h:mm A') : 'N/A'}
          </span>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge className={statusStyles[status as keyof typeof statusStyles]}>
            {status === 'Scheduled' && <Clock className="mr-1 h-3 w-3" />}
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'viewed_count',
      header: 'Viewed',
      cell: ({ row }) => row.getValue('viewed_count') || '0'
    },
    {
      accessorKey: 'clicked_count',
      header: 'Clicked',
      cell: ({ row }) => row.getValue('clicked_count') || '0'
    },
    {
      accessorKey: 'dismissed_count',
      header: 'Dismissed',
      cell: ({ row }) => row.getValue('dismissed_count') || '0'
    }
  ];

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
    }
    // ... other notifications
  ];

  const table = useReactTable({
    data: mockNotifications,
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

  return (
    <Card className="m-5 overflow-hidden bg-white shadow-sm">
      <CardHeader className="bg-primary/30 text-secondary backdrop:blur-xl">
        <CardTitle className="font-industry text-2xl font-bold">
          Push Notifications
        </CardTitle>
        <CardDescription className="text-primary">
          View all push notifications
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
                  No notifications found.
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
    </Card>
  );
}
