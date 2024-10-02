'use client'

import React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNotifications } from '@/app/contexts/NotifcationsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Notification } from '@/types'



const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => row.getValue('title') || 'N/A',
  },
  {
    accessorKey: 'modal_type',
    header: 'Type',
  },
  {
    accessorKey: 'created_at',
    header: 'Created at',
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {new Date(row.getValue('created_at')).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'expires_at',
    header: 'Expiration Date',
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {row.getValue('expires_at') ? new Date(row.getValue('expires_at')).toLocaleString() : 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'viewed_count',
    header: 'Viewed',
    cell: ({ row }) => row.getValue('viewed_count') || '0',
  },
  {
    accessorKey: 'clicked_count',
    header: 'Clicked',
    cell: ({ row }) => row.getValue('clicked_count') || '0',
  },
  {
    accessorKey: 'dismissed_count',
    header: 'Dismissed',
    cell: ({ row }) => row.getValue('dismissed_count') || '0',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]

export default function CompletedNotificationsTable() {
  const { notifications, loading, error } = useNotifications()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const cancelledNotifications = React.useMemo(() => 
    notifications.filter(notification => notification.status === "Completed"),
    [notifications]
  )

  const table = useReactTable({
    data: cancelledNotifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card className="m-5 shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-primary/30 backdrop:blur-xl text-secondary">
        <CardTitle className="text-2xl font-industry font-bold">Cancelled Notifications</CardTitle>
        <CardDescription className="text-primary">View all cancelled in-app notifications</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="mt-2 p-2 rounded">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-foreground rounded cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        header.column.getIsSorted() === 'asc'
                          ? <ChevronUp className="inline ml-1" />
                          : <ChevronDown className="inline ml-1" />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-secondary/10 rounded dark:hover:"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No cancelled notifications.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}