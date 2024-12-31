'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { StaffMember, RosterMember } from '@/types/team';
import { useSession } from 'next-auth/react';
import { toast } from '../ui/use-toast';
import { uploadImage, upsertTeamMember } from '@/app/actions';
import Image from 'next/image';

type EditTeamMemberFormProps = {
  type: 'staff' | 'roster';
  initialData: StaffMember | RosterMember;
  teamId: string;
  onSuccess?: (result: any) => void;
};

const EditTeamMemberForm: React.FC<EditTeamMemberFormProps> = ({
  type,
  initialData,
  teamId,
  onSuccess
}) => {
  const [formData, setFormData] = useState<StaffMember | RosterMember>({
    ...initialData,
    bio: initialData.bio || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const formatDateForAPI = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return dateString;
    }
  };

  const validateFormData = () => {
    if (type === 'roster') {
      const requiredFields = [
        'name',
        'position',
        'height',
        'weight',
        'hometown',
        'date_of_birth',
        'bio'
      ];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field.replace('_', ' ')} is required`);
        }
      }
    } else {
      const requiredFields = ['name', 'job_title', 'bio'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field.replace('_', ' ')} is required`);
        }
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
      return;
    }

    if (name === 'date_of_birth') {
      setFormData((prev) => ({
        ...prev,
        [name]: formatDateForAPI(value)
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const { url } = await uploadImage(formData, session?.user.token!);
      setFormData((prev) => ({ ...prev, portrait: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      validateFormData();
      const memberId = 'id' in formData ? formData.id : formData.team_id;

      const requestBody = isRosterMember(formData)
        ? {
            name: formData.name,
            position: formData.position,
            height: formData.height,
            weight: formData.weight,
            hometown: formData.hometown,
            date_of_birth: formData.date_of_birth?.split('T')[0],
            bio: formData.bio,
            portrait: formData.portrait,
            is_active: formData.is_active
          }
        : {
            name: formData.name,
            job_title: formData.job_title,
            bio: formData.bio,
            portrait: formData.portrait,
            is_coach: formData.is_coach
          };

      const result = await upsertTeamMember({
        teamId,
        type,
        memberId,
        data: requestBody,
        token: session?.user.token!
      });

      toast({
        title: 'Success',
        description: memberId
          ? 'Member updated successfully'
          : 'Member added successfully'
      });
      onSuccess?.(result);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStaffMember = (
    data: StaffMember | RosterMember
  ): data is StaffMember => {
    return 'job_title' in data;
  };

  const isRosterMember = (
    data: StaffMember | RosterMember
  ): data is RosterMember => {
    return 'position' in data;
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-industry-ultra">
          {formData.team_id ? 'Edit' : 'Add'}{' '}
          {type === 'staff' ? 'Staff Member' : 'Player'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="min-h-32"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portrait">Portrait Image</Label>
            <div className="flex flex-col gap-4">
              {formData.portrait && (
                <Image
                  src={formData.portrait}
                  alt="Current portrait"
                  height={120}
                  width={120}
                  className="h-32 w-32 rounded-lg object-cover"
                />
              )}
              <Input
                id="portraitFile"
                name="portraitFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Label htmlFor="portraitUrl">Or Enter Image URL</Label>
              <Input
                id="portraitUrl"
                name="portraitUrl"
                type="url"
                placeholder="Enter image URL"
                value={formData.portrait || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    portrait: e.target.value
                  }))
                }
              />
            </div>
          </div>
          {/* Staff-specific fields */}
          {type === 'staff' && isStaffMember(formData) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_coach"
                  name="is_coach"
                  checked={formData.is_coach}
                  onCheckedChange={(checked) =>
                    handleInputChange({
                      target: { name: 'is_coach', type: 'checkbox', checked }
                    } as any)
                  }
                />
                <Label htmlFor="is_coach">Is Coach</Label>
              </div>
            </>
          )}

          {/* Roster-specific fields */}
          {type === 'roster' && isRosterMember(formData) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (ft)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="heightFt"
                      name="heightFt"
                      type="number"
                      value={Math.floor(
                        Number(formData.height || 0) / 2.54 / 12
                      )}
                      onChange={(e) => {
                        const ft = parseInt(e.target.value || '0');
                        const inches = parseInt(
                          (
                            document.getElementById(
                              'heightIn'
                            ) as HTMLInputElement
                          )?.value || '0'
                        );
                        const totalInches = ft * 12 + inches;
                        const cm = Math.floor(totalInches * 2.54);
                        setFormData((prev) => ({
                          ...prev,
                          height: cm
                        }));
                      }}
                      required
                      className="w-20"
                      min="0"
                    />
                    <span className="self-center">ft</span>
                    <Input
                      id="heightIn"
                      name="heightIn"
                      type="number"
                      value={Math.round(
                        (Number(formData.height || 0) / 2.54) % 12
                      )}
                      onChange={(e) => {
                        const inches = parseInt(e.target.value || '0');
                        const ft = parseInt(
                          (
                            document.getElementById(
                              'heightFt'
                            ) as HTMLInputElement
                          )?.value || '0'
                        );
                        const totalInches = ft * 12 + inches;
                        const cm = Math.floor(totalInches * 2.54);
                        setFormData((prev) => ({
                          ...prev,
                          height: cm
                        }));
                      }}
                      required
                      className="w-20"
                      min="0"
                      max="11"
                    />
                    <span className="self-center">in</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={Math.round(Number(formData.weight || 0) * 2.20462)}
                    onChange={(e) => {
                      const lbs = parseInt(e.target.value || '0');
                      const kg = Math.floor(lbs / 2.20462);
                      setFormData((prev) => ({
                        ...prev,
                        weight: kg
                      }));
                    }}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hometown">Hometown</Label>
                <Input
                  id="hometown"
                  name="hometown"
                  value={formData.hometown}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={
                    formData.date_of_birth
                      ? format(new Date(formData.date_of_birth), 'yyyy-MM-dd')
                      : ''
                  }
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleInputChange({
                      target: { name: 'is_active', type: 'checkbox', checked }
                    } as any)
                  }
                />
                <Label htmlFor="is_active">Is Active</Label>
              </div>
            </>
          )}

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button
            variant={isLoading ? 'default' : 'secondary'}
            type="submit"
            disabled={isLoading}
            className="hover:bg-green/90 w-full bg-black"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditTeamMemberForm;
