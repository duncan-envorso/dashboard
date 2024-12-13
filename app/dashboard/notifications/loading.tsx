// app/notifications/loading.tsx

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export default function Loading() {
  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6">
      {/* Repeat the skeleton twice for both tables */}
      {[1, 2].map((index) => (
        <Card key={index} className="overflow-hidden bg-white shadow-sm">
          <CardHeader className="bg-primary/30 text-secondary backdrop:blur-xl">
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="mt-2 h-4 w-[200px]" />
          </CardHeader>
          <CardContent className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="mt-2 rounded p-2">
                  {[...Array(8)].map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[...Array(8)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between space-x-2 py-4">
              <Skeleton className="h-4 w-[100px]" />
              <div className="space-x-2">
                <Skeleton className="inline-block h-8 w-[100px]" />
                <Skeleton className="inline-block h-8 w-[100px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
