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
import { Notification, useNotifications } from '@/app/contexts/NotifcationsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronUp, ChevronDown } from 'lucide-react'

const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
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
        {new Date(row.original.created_at).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
  },
  {
    accessorKey: 'sending_at',
    header: 'Sending at',
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {row.original.sending_at ? new Date(row.original.sending_at).toLocaleString() : 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'expiration_date',
    header: 'Expires at',
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {row.original.expiration_date ? new Date(row.original.expiration_date).toLocaleString() : 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'delivered',
    header: 'Delivered',
    cell: ({ row }) => (
      typeof row.original.delivered === 'number' ? row.original.delivered : 'N/A'
    ),
  },
  {
    accessorKey: 'clicked',
    header: 'Clicked',
    cell: ({ row }) => (
      typeof row.original.clicked === 'number' ? row.original.clicked : 'N/A'
    ),
  },
  {
    accessorKey: 'opened',
    header: 'Opened',
    cell: ({ row }) => (
      typeof row.original.opened === 'boolean' ? (row.original.opened ? 'Yes' : 'No') : 'N/A'
    ),
  },
]

export default function DraftNotifications() {
  const { notifications, loading, error } = useNotifications()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const draftNotifications = React.useMemo(() => 
    notifications.filter(notification => notification.status === "Draft"),
    [notifications]
  )

  const table = useReactTable({
    data: draftNotifications,
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
    <Card className="m-5 border-l-4 border-l-primary shadow-md overflow-hidden">
    <CardHeader className="bg-primary text-primary-foreground">
      <CardTitle className="text-2xl font-industry font-bold">Draft Notifications</CardTitle>
      <CardDescription className="text-primary-foreground/80">View all draft in-app notifications</CardDescription>
    </CardHeader>
    <CardContent className="mt-4 overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-secondary/20 mt-2 p-2 rounded dark:bg-secondary/30">
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
                className="hover:bg-secondary/10 rounded dark:hover:bg-secondary/20"
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
                No draft notifications.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  )
}