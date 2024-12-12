'use client';

import * as z from 'zod';
import { useState, useEffect } from 'react';
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

export type Permission =
  | 'Administrator'
  | 'Live Commentary'
  | 'Send Alerts'
  | 'Post Articles'
  | 'Manage Roster'
  | 'Manage Access';

export interface User {
  id: string; // UUID format
  email: string;
  permissions: Permission[]; // Array of permissions
}

// Form schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  permissions: z.record(z.boolean()).default({})
});

type FormValues = z.infer<typeof formSchema>;

export const UserForm = ({ userId }: { userId?: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      permissions: {
        Administrator: false,
        'Live Commentary': false,
        'Send Alerts': false,
        'Post Articles': false,
        'Manage Roster': false,
        'Manage Access': false
      }
    }
  });

  // Fetch user data if editing an existing user
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const token = session?.user?.token;
          if (!token) {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Authentication token is missing.'
            });
            return;
          }

          const response = await fetch(
            `https://api.seawolves.envorso.com/v1/users/${userId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.ok) {
            const userData = await response.json();
            // Populate the form with the fetched user data
            form.setValue('email', userData.email);
            const userPermissions = userData.permissions.reduce(
              (acc: Record<Permission, boolean>, permission: Permission) => {
                acc[permission] = true;
                return acc;
              },
              {}
            );
            form.setValue('permissions', userPermissions);
          } else {
            const errorData = await response.json();
            toast({
              variant: 'destructive',
              title: 'Error',
              description: errorData.message || 'Failed to fetch user data.'
            });
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Something went wrong while fetching user data.'
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [userId, session, form, toast]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      // Extract selected permissions
      const selectedPermissions = Object.entries(data.permissions)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([permission]) => permission as Permission);

      // Get the bearer token from session
      const token = session?.user?.token;
      const teamId = session?.user?.teamId;

      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Authentication token is missing.'
        });
        return;
      }

      let apiUrl = 'https://api.seawolves.envorso.com/v1/signup';
      let method = 'POST';
      let body = JSON.stringify({
        email: data.email,
        password: 'securepassword', // Replace with your password generation logic
        teamId: teamId // Use the current team ID
      });

      // If editing, update the user
      if (userId) {
        apiUrl = `https://api.seawolves.envorso.com/v1/users/${userId}`;
        method = 'PUT';
        body = JSON.stringify({
          email: data.email,
          permissions: selectedPermissions
        });
      }

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            errorData.message ||
            (userId ? 'Failed to update user.' : 'Failed to create user.')
        });
        return;
      }

      const successMessage = userId
        ? 'User updated successfully.'
        : 'User created successfully.';
      toast({
        title: 'Success',
        description: successMessage
      });

      // Navigate to users list
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userId ? 'Edit User' : 'Create User'}</CardTitle>
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
                      disabled={loading}
                      type="email"
                      placeholder="email@example.com"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <div className="space-y-2">
                    {(Object.keys(field.value) as Permission[]).map(
                      (permission) => (
                        <div
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            disabled={loading}
                            checked={field.value[permission]}
                            onCheckedChange={(checked) => {
                              form.setValue(
                                `permissions.${permission}`,
                                Boolean(checked)
                              ); // Cast to boolean
                            }}
                          />

                          <FormLabel>{permission}</FormLabel>
                        </div>
                      )
                    )}
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
