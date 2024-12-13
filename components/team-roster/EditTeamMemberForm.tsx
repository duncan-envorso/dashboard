import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { StaffMember, RosterMember } from '@/types/team';
import { useSession } from 'next-auth/react';

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
  const [formData, setFormData] = useState<StaffMember | RosterMember>(
    initialData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value)
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.user.token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await response.json();
      setFormData((prev) => ({
        ...prev,
        portrait: url
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = `/api/teams/${teamId}/${
        type === 'staff' ? 'staff' : 'roster'
      }`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update team member');
      }

      const result = await response.json();
      onSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
        <CardTitle>
          Edit {type === 'staff' ? 'Staff Member' : 'Player'}
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
                <img
                  src={formData.portrait}
                  alt="Current portrait"
                  className="h-32 w-32 rounded-lg object-cover"
                />
              )}
              <Input
                id="portrait"
                name="portrait"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
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
                  value={formData.date_of_birth}
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditTeamMemberForm;
