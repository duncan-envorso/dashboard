'use client';

import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_API_URL;
const USERS_ENDPOINT = `${API_URL}/users`;
const SIGNUP_ENDPOINT = `${API_URL}/signup`;

export type Permission =
  | 'Administrator'
  | 'Live Commentary'
  | 'Send Alerts'
  | 'Post Articles'
  | 'Manage Roster'
  | 'Manage Access';

interface UserFormProps {
  userId?: string;
  initialData?: {
    email: string;
    permissions: Permission[];
  };
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  permissions: z.array(z.string())
});

type FormValues = z.infer<typeof formSchema>;

export const UserForm = ({ userId, initialData }: UserFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email || '',
      permissions: initialData?.permissions || []
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!session?.user?.token) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Not authenticated'
      });
      return;
    }

    setLoading(true);

    try {
      if (userId) {
        const currentPermissions = initialData?.permissions || [];
        const newPermissions = data.permissions;

        const permissionsToAdd = newPermissions.filter(
          (p) => !currentPermissions.includes(p as Permission)
        );

        const permissionsToRemove = currentPermissions.filter(
          (p) => !newPermissions.includes(p)
        );

        for (const permission of permissionsToAdd) {
          await fetch(`${USERS_ENDPOINT}/${userId}/permissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.user.token}`
            },
            body: JSON.stringify({ permissionName: permission })
          });
        }

        for (const permission of permissionsToRemove) {
          await fetch(`${USERS_ENDPOINT}/${userId}/permissions/${permission}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${session.user.token}`
            }
          });
        }
      } else {
        await fetch(SIGNUP_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`
          },
          body: JSON.stringify({
            email: data.email,
            permissions: data.permissions,
            teamId: session.user.teamId
          })
        });
      }

      toast({
        title: 'Success',
        description: userId
          ? 'User permissions updated successfully'
          : 'User created successfully'
      });

      router.push('/dashboard/user-management');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: userId
          ? 'Failed to update user permissions'
          : 'Failed to create user'
      });
    } finally {
      setLoading(false);
    }
  };

  const availablePermissions: Permission[] = [
    'Administrator',
    'Live Commentary',
    'Send Alerts',
    'Post Articles',
    'Manage Roster',
    'Manage Access'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userId ? 'Edit User' : 'Create New User'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!!userId}
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <div className="space-y-2">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          disabled={loading}
                          checked={form
                            .watch('permissions')
                            .includes(permission)}
                          onCheckedChange={(checked) => {
                            const currentPermissions =
                              form.getValues('permissions');
                            if (checked) {
                              form.setValue('permissions', [
                                ...currentPermissions,
                                permission
                              ]);
                            } else {
                              form.setValue(
                                'permissions',
                                currentPermissions.filter(
                                  (p) => p !== permission
                                )
                              );
                            }
                          }}
                        />
                        <FormLabel className="text-sm font-normal">
                          {permission}
                        </FormLabel>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : userId ? 'Save Changes' : 'Create User'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
