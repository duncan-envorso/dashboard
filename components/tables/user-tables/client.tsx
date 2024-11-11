'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { User, UserStats } from '@/types/user';
import { Plus, Filter, Download, Upload, RefreshCw, Users, Shield, CalendarClock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from 'date-fns';

interface UserClientProps {
  data: User[];
  stats: UserStats;  // Using the exported UserStats type

}

export const UserClient: React.FC<UserClientProps> = ({ data, stats }) => {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Get unique values for filters
  const departments = Array.from(new Set(data.map(user => user.department)));
  const accessLevels = Array.from(new Set(data.map(user => user.accessLevel)));
  const statuses = Array.from(new Set(data.map(user => user.status)));

  // Filter data based on selections
  const filteredData = data.filter(user => {
    const matchDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    const matchAccess = selectedAccessLevel === 'all' || user.accessLevel === selectedAccessLevel;
    const matchStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchDepartment && matchAccess && matchStatus;
  });

  // Calculate additional stats
  const admins = data.filter(user => user.accessLevel === 'Admin').length;
  const lastUpdatedUser = [...data].sort((a, b) => 
    new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  )[0];

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Department', 'Role', 'Access Level', 'Status', 'Last Active'],
      ...filteredData.map(user => [
        user.name,
        user.email,
        user.department,
        user.role,
        user.accessLevel,
        user.status,
        user.lastActive
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading
            title="Website User Management"
            description={`Manage website access and permissions for team staff`}
          />
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} total users • {stats.active} active • {stats.verified} verified
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => router.push(`/dashboard/user/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Users className="h-4 w-4 inline-block mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.active / stats.total) * 100).toFixed(1)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Shield className="h-4 w-4 inline-block mr-2" />
              Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins}</div>
            <p className="text-xs text-muted-foreground">
              {((admins / stats.total) * 100).toFixed(1)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              Most active: Media ({stats.departments.media})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <CalendarClock className="h-4 w-4 inline-block mr-2" />
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastUpdatedUser ? format(new Date(lastUpdatedUser.updatedAt || ''), 'MMM d') : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              by {lastUpdatedUser?.name.split(' ')[0]}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedAccessLevel}
            onValueChange={setSelectedAccessLevel}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Access Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Access Levels</SelectItem>
              {accessLevels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Separator />

      <DataTable 
        searchKey="name" 
        columns={columns} 
        data={filteredData}
      
      />

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Last updated {format(new Date(), 'MMMM d, yyyy')}
        </p>
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} users
        </p>
      </div>
    </div>
  );
};