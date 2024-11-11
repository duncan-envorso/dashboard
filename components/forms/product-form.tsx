'use client';

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertCircle, Trash, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { User, UserFormData, DEPARTMENTS, DEPARTMENT_ROLES, DEFAULT_USER_FORM_VALUES } from '@/types/user';
import { getUserById } from '@/app/utils/userData';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  department: z.string().min(1, { message: 'Please select a department' }),
  role: z.string().min(1, { message: 'Please select a role' }),
  accessLevel: z.enum(['Admin', 'Editor', 'Viewer'], {
    required_error: 'Please select an access level',
  }),
  avatar: z.object({
    fileName: z.string(),
    fileUrl: z.string(),
  }).optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  verified: z.boolean().default(false),
  sendWelcomeEmail: z.boolean().default(true),
  permissions: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

export const UserForm = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialData, setInitialData] = useState<User | null>(null);

  // Fetch user data if editing
  useEffect(() => {
    const fetchUser = async () => {
      if (params.userId && params.userId !== 'new') {
        try {
          setLoading(true);
          const userData = await getUserById(Number(params.userId));
          if (userData) {
            setInitialData(userData);
            // Reset form with fetched data
            form.reset({
              name: userData.name,
              email: userData.email,
              department: userData.department,
              role: userData.role,
              accessLevel: userData.accessLevel,
              status: userData.status,
              verified: userData.verified,
              permissions: userData.permissions,
              sendWelcomeEmail: false,
              ...(userData.avatar && { avatar: userData.avatar }),
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch user data",
            variant: "destructive",
          });
          router.push('/dashboard/users');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [params.userId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_USER_FORM_VALUES,
  });

  const isNewUser = !params.userId || params.userId === 'new';
  const title = isNewUser ? 'Create User' : 'Edit User';
  const description = isNewUser ? 'Add a new user to the system.' : 'Edit user details and permissions.';
  const toastMessage = isNewUser ? 'User created successfully.' : 'User updated successfully.';
  const action = isNewUser ? 'Create' : 'Save changes';

  const selectedDepartment = form.watch('department');
  const selectedAccessLevel = form.watch('accessLevel');
  const isEditingAdmin = initialData?.accessLevel === 'Admin';

  // Get roles for selected department
  const availableRoles = selectedDepartment ?
    DEPARTMENT_ROLES[selectedDepartment as keyof typeof DEPARTMENT_ROLES] :
    [];

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      if (params.userId && params.userId !== 'new') {
        // Update existing user
        await fetch(`/api/users/${params.userId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      } else {
        // Create new user
        await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }

      toast({
        title: "Success",
        description: toastMessage,
      });

      router.refresh();
      router.push('/dashboard/users');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setDeleteLoading(true);
      if (params.userId && params.userId !== 'new') {
        await fetch(`/api/users/${params.userId}`, {
          method: 'DELETE',
        });
        toast({
          title: "Success",
          description: "User deleted successfully.",
        });
        router.refresh();
        router.push('/dashboard/users');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error deleting user.',
      });
    } finally {
      setDeleteLoading(false);
      setOpen(false);
    }
  };

  // Show warning if editing admin user

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={deleteLoading}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading || deleteLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isEditingAdmin && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You are editing an administrator account. Changes may affect system access.
          </AlertDescription>
        </Alert>
      )}

      <Separator className="my-4" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user details and role assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={loading || (initialData && initialData.verified) ? true : false}
                            placeholder="email@example.com"
                            {...field}
                          />
                        </FormControl>
                        {initialData && initialData.verified && (
                          <FormDescription>
                            Email cannot be changed for verified users
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('role', ''); // Reset role when department changes
                          }}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DEPARTMENTS.map((department) => (
                              <SelectItem key={department.id} value={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          disabled={loading || !selectedDepartment}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access & Permissions</CardTitle>
            <CardDescription>User access level and system permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level</FormLabel>
                      <Select
                        disabled={loading || (initialData?.accessLevel === 'Admin')}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Administrator</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {initialData?.accessLevel === 'Admin' ?
                          "Admin access level cannot be changed" :
                          "Determines the user's system-wide permissions"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Status</FormLabel>
                      <Select
                        disabled={loading || (initialData?.accessLevel === 'Admin')}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!initialData && (
                  <FormField
                    control={form.control}
                    name="sendWelcomeEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Send welcome email
                          </FormLabel>
                          <FormDescription>
                            Send an email with login credentials
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                 
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
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
