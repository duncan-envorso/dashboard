'use client'

import React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNotifications } from '@/app/contexts/NotifcationsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
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
    accessorKey: 'expiration_date',
    header: 'Expires at',
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {row.getValue('expiration_date') ? new Date(row.getValue('expiration_date')).toLocaleString() : 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'viewed_count',
    header: 'Viewed',
    cell: ({ row }) => row.getValue('viewed_count') || '-',
  },
  {
    accessorKey: 'clicked_count',
    header: 'Clicked',
    cell: ({ row }) => row.getValue('clicked_count') || '-',
  },
  {
    accessorKey: 'dismissed_count',
    header: 'Dismissed',
    cell: ({ row }) => row.getValue('dismissed_count') || '-',
  },
]

export default function ScheduledNotifications() {
  const { notifications, loading, error } = useNotifications()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const expiredNotifications = React.useMemo(() => {
    const now = new Date()
    return notifications.filter(notification => 
      new Date(notification.expiration_date) < now && 
      notification.status == "Scheduled"
    )
  }, [notifications])

  const table = useReactTable({
    data: expiredNotifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card className="m-5 shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-primary/30 backdrop:blur-xl text-secondary">
        <CardTitle className="text-2xl font-industry font-bold">Scheduled Notifications</CardTitle>
        <CardDescription className="text-primary">View all Scheduled in-app notifications</CardDescription>
      </CardHeader>
      <CardContent className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-green/20 mt-2 p-2 rounded dark:bg-green/30">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-navy rounded cursor-pointer"
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
                  className="hover:bg-green/10 rounded dark:hover:bg-green/20"
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
                  No Scheduled notifications.
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
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}