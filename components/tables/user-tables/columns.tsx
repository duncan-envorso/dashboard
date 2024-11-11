'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User, AccessLevel, UserStatus } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Circle,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Inactive':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getAccessLevelIcon = (accessLevel: AccessLevel) => {
  switch (accessLevel) {
    case 'Admin':
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
    case 'Editor':
      return <ShieldCheck className="h-4 w-4 text-blue-500" />;
    case 'Viewer':
      return <Shield className="h-4 w-4 text-gray-500" />;
  }
};

const getAccessLevelDescription = (accessLevel: AccessLevel): string => {
  switch (accessLevel) {
    case 'Admin':
      return 'Full system access with user management capabilities';
    case 'Editor':
      return 'Can create and modify content';
    case 'Viewer':
      return 'Read-only access to content';
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const formatLastActive = (date: string | undefined): string => {
  if (!date) return 'Never';
  const lastActive = new Date(date);
  return formatDistanceToNow(lastActive, { addSuffix: true });
};

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'USER',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            {user.avatar ? (
              <AvatarImage src={user.avatar.fileUrl} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-primary/10">
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{user.name}</span>
              {user.accessLevel === 'Admin' && (
                <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                  Admin
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
            <span className="text-xs text-muted-foreground">
              Active: {formatLastActive(user.lastActive)}
            </span>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'department',
    header: 'DEPARTMENT',
    cell: ({ row }) => {
      const dept = row.original.department;
      return (
        <Badge variant="outline" className="font-medium capitalize">
          {dept}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({ row }) => {
      return (
        <span className="text-sm whitespace-nowrap">{row.original.role}</span>
      );
    }
  },
  {
    accessorKey: 'accessLevel',
    header: 'ACCESS',
    cell: ({ row }) => {
      const accessLevel = row.original.accessLevel;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                {getAccessLevelIcon(accessLevel)}
                <span className="text-sm">{accessLevel}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{getAccessLevelDescription(accessLevel)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {row.original.permissions.length} permissions granted
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2">
          {status === 'Active' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        </div>
      );
    }
  },
  {
    accessorKey: 'verified',
    header: 'VERIFIED',
    cell: ({ row }) => {
      const verified = row.original.verified;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant={verified ? "outline" : "secondary"}
                className={`font-medium ${
                  verified ? 'border-green-200 bg-green-50 text-green-700' : ''
                }`}
              >
                {verified ? 'Verified' : 'Unverified'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {verified ? (
                <p>User has verified their account</p>
              ) : (
                <p>User hasnt verified their account yet</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

// Column configuration and presets
export const columnConfig = {
  defaultVisible: {
    select: true,
    name: true,
    department: true,
    role: true,
    accessLevel: true,
    status: true,
    verified: true,
    actions: true
  },
  defaultSorting: [
    {
      id: 'name',
      desc: false
    }
  ],
  defaultFiltering: {
    status: 'Active'
  }
};

// Export helper for getting visible columns based on user role
export const getVisibleColumns = (userRole: AccessLevel) => {
  if (userRole === 'Admin') {
    return columnConfig.defaultVisible;
  }
  
  return {
    ...columnConfig.defaultVisible,
    select: false,
    verified: false
  };
};