'use client';

import { useState } from 'react';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { User, UserStatus, AccessLevel } from '@/types/user';
import {
  Edit,
  MoreHorizontal,
  Trash,
  Shield,
  UserX,
  RefreshCw,
  Send,
  Key,
  UserCheck,
  AlertTriangle,
  Lock,
  UserCog,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  data: User;
}

type ActionType = 'delete' | 'deactivate' | 'revoke' | 'reactivate';

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>('delete');
  const router = useRouter();

  const isInactive = data.status === 'Inactive';
  const isAdmin = data.accessLevel === 'Admin';

  const onConfirm = async () => {
    try {
      setLoading(true);
      
      // Here you would make API calls for each action
      switch (actionType) {
        case 'delete':
          // await deleteUser(data.id);
          toast({
            title: "User Deleted",
            description: `${data.name} has been removed from the system.`,
          });
          break;
        case 'deactivate':
          // await updateUserStatus(data.id, 'Inactive');
          toast({
            title: "User Deactivated",
            description: `${data.name}'s account has been deactivated.`,
          });
          break;
        case 'reactivate':
          // await updateUserStatus(data.id, 'Active');
          toast({
            title: "User Reactivated",
            description: `${data.name}'s account has been reactivated.`,
          });
          break;
        case 'revoke':
          // await revokeUserAccess(data.id);
          toast({
            title: "Access Revoked",
            description: `${data.name}'s access has been revoked.`,
          });
          break;
      }
      
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalContent = () => {
    switch (actionType) {
      case 'delete':
        return {
          title: "Delete User",
          description: "Are you sure you want to delete this user? This action cannot be undone.",
        };
      case 'deactivate':
        return {
          title: "Deactivate User",
          description: "Are you sure you want to deactivate this user's account?",
        };
      case 'reactivate':
        return {
          title: "Reactivate User",
          description: "Are you sure you want to reactivate this user's account?",
        };
      case 'revoke':
        return {
          title: "Revoke Access",
          description: "Are you sure you want to revoke this user's access permissions?",
        };
    }
  };

  const handleActionClick = (action: ActionType) => {
    setActionType(action);
    setOpen(true);
  };

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      // await sendPasswordReset(data.email);
      toast({
        title: "Password Reset Email Sent",
        description: `A password reset link has been sent to ${data.email}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    try {
      setLoading(true);
      // await sendVerification(data.email);
      toast({
        title: "Verification Email Sent",
        description: `A verification email has been sent to ${data.email}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        {...getModalContent()}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center space-x-2">
            <span>User Actions</span>
            {isInactive && <XCircle className="h-4 w-4 text-red-500" />}
          </DropdownMenuLabel>
          
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/user/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Shield className="mr-2 h-4 w-4" /> Access Control
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => router.push(`/dashboard/users/${data.id}/permissions`)}
                disabled={isInactive}
              >
                <UserCog className="mr-2 h-4 w-4" /> Manage Permissions
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleActionClick('revoke')}
                disabled={isInactive || isAdmin}
              >
                <AlertTriangle className="mr-2 h-4 w-4" /> Revoke Access
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Lock className="mr-2 h-4 w-4" /> Security
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={handlePasswordReset}
                disabled={isInactive}
              >
                <Key className="mr-2 h-4 w-4" /> Reset Password
              </DropdownMenuItem>
              {!data.verified && (
                <DropdownMenuItem 
                  onClick={handleVerification}
                  disabled={isInactive}
                >
                  <UserCheck className="mr-2 h-4 w-4" /> Send Verification
                </DropdownMenuItem>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          {isInactive ? (
            <DropdownMenuItem 
              onClick={() => handleActionClick('reactivate')}
              className="text-green-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Reactivate Account
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={() => handleActionClick('deactivate')}
              disabled={isAdmin}
            >
              <UserX className="mr-2 h-4 w-4" /> Deactivate Account
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => handleActionClick('delete')}
            className="text-red-600"
            disabled={isAdmin}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};