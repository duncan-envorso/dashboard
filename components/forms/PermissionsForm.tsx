'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Shield,
  FileText,
  MessageSquare,
  Users,
  Bell,
  Lock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { getUserPermissions } from '@/app/actions';

interface Permission {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  isEnabled: boolean;
}

const DEFAULT_PERMISSIONS: Omit<Permission, 'isEnabled'>[] = [
  {
    id: 'admin',
    label: 'Administrator',
    description: 'Full system access and control',
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 'postArticle',
    label: 'Post Articles',
    description: 'Create and publish articles',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'liveCommentary',
    label: 'Live Commentary',
    description: 'Provide match commentary',
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    id: 'manageRoster',
    label: 'Manage Roster',
    description: 'Update team and player information',
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 'sendAlerts',
    label: 'Send Alerts',
    description: 'Send push notifications and modal alerts',
    icon: <Bell className="h-5 w-5" />
  },
  {
    id: 'manageAccess',
    label: 'Manage Access',
    description: 'Control user permissions and access',
    icon: <Lock className="h-5 w-5" />
  }
];

interface PermissionsFormProps {
  form: any;
  loading?: boolean;
  onSubmit: (values: any) => void;
  action: string;
  params?: { userId: string };
}

export function PermissionsForm({
  form,
  loading,
  onSubmit,
  action,
  params
}: PermissionsFormProps) {
  const router = useRouter();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    async function loadPermissions() {
      if (params?.userId) {
        try {
          const userPermissions = await getUserPermissions(params.userId);
          console.log('userperm', userPermissions);

          // Map user permissions to full permission objects
          const fullPermissions = DEFAULT_PERMISSIONS.map((perm) => ({
            ...perm,
            isEnabled: userPermissions.includes(perm.id)
          }));

          setPermissions(fullPermissions);

          // Set initial form values
          const permissionValues = fullPermissions.reduce(
            (acc, p) => ({
              ...acc,
              [p.id]: p.isEnabled
            }),
            {}
          );
          form.setValue('permissions', permissionValues);

          // Set access level based on admin permission
          const hasAdmin = userPermissions.includes('admin');
          form.setValue('accessLevel', hasAdmin ? 'Admin' : 'Editor');
        } catch (error) {
          console.error('Error loading permissions:', error);
          // Set default permissions if there's an error
          setPermissions(
            DEFAULT_PERMISSIONS.map((p) => ({ ...p, isEnabled: false }))
          );
        }
      } else {
        // New user case - set default permissions
        setPermissions(
          DEFAULT_PERMISSIONS.map((p) => ({ ...p, isEnabled: false }))
        );
      }
      setIsLoading(false);
    }

    loadPermissions();
  }, [params?.userId, form]);

  const handleToggle = (permissionId: string, enabled: boolean) => {
    if (permissionId === 'admin') {
      if (enabled) {
        setShowAdminModal(true);
        return;
      }
      updatePermissions(permissionId, enabled);
      return;
    }

    updatePermissions(permissionId, enabled);
  };

  const updatePermissions = (permissionId: string, enabled: boolean) => {
    let updatedPermissions = [...permissions];

    if (permissionId === 'admin') {
      updatedPermissions = updatedPermissions.map((p) => ({
        ...p,
        isEnabled: enabled
      }));
      form.setValue('accessLevel', enabled ? 'Admin' : 'Editor');
    } else {
      updatedPermissions = updatedPermissions.map((p) =>
        p.id === permissionId ? { ...p, isEnabled: enabled } : p
      );

      const adminPermission = updatedPermissions.find((p) => p.id === 'admin');
      if (adminPermission) {
        adminPermission.isEnabled = updatedPermissions.every(
          (p) => p.id === 'admin' || p.isEnabled
        );
      }

      form.setValue(
        'accessLevel',
        adminPermission?.isEnabled ? 'Admin' : 'Editor'
      );
    }

    setPermissions(updatedPermissions);

    const permissionValues = updatedPermissions.reduce(
      (acc, p) => ({
        ...acc,
        [p.id]: p.isEnabled
      }),
      {}
    );
    form.setValue('permissions', permissionValues);
  };

  const handleAdminConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      updatePermissions('admin', true);
    }
    setShowAdminModal(false);
  };

  if (isLoading) {
    return (
      <Card className="mx-auto w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Access & Permissions
        </CardTitle>
        <CardDescription>
          Configure user access level and specific permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {permissions.map((permission) => (
                <FormField
                  key={permission.id}
                  name={`permissions.${permission.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <div
                        className={`flex items-center justify-between rounded-lg border p-4 transition-colors duration-200 ease-in-out ${
                          permission.id === 'admin'
                            ? 'border-primary bg-primary/10'
                            : permission.isEnabled
                            ? 'border-secondary bg-secondary/20'
                            : 'bg-background hover:bg-secondary/10'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <div
                              className={`mr-2 ${
                                permission.id === 'admin'
                                  ? 'text-primary'
                                  : 'text-foreground'
                              }`}
                            >
                              {permission.icon}
                            </div>
                            <FormLabel className="text-base font-medium">
                              {permission.label}
                            </FormLabel>
                          </div>
                          <FormDescription className="text-sm">
                            {permission.description}
                          </FormDescription>
                        </div>
                        <Switch
                          checked={field.value || permission.isEnabled}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleToggle(permission.id, checked);
                          }}
                          aria-label={`Toggle ${permission.label} permission`}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          type="button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          onClick={form.handleSubmit(onSubmit)}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {action}
        </Button>
      </CardFooter>

      <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Administrator Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to grant full administrator access? This
              will enable all permissions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleAdminConfirmation(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => handleAdminConfirmation(true)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
