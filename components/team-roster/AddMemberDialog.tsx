import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RosterMember, StaffMember } from '@/types/team';

type MemberType = 'roster' | 'staff';

const RUGBY_POSITIONS = [
  'Flanker',
  'Hooker',
  'Prop',
  'Fly-Half',
  'Wing',
  'Fullback',
  'Lock',
  'Scrum Half',
  'Center',
  'Outside Back',
  'Number Eight'
] as const;

interface AddMemberDialogProps {
  isOpen: boolean;
  teamId: string;
  onClose: () => void;
  onAdd: (memberData: Partial<RosterMember | StaffMember>) => void;
}

export function AddMemberDialog({
  isOpen,
  teamId,
  onClose,
  onAdd
}: AddMemberDialogProps) {
  const [memberType, setMemberType] = useState<MemberType>('roster');
  const [memberData, setMemberData] = useState({
    name: '',
    position: '',
    job_title: '',
    height: 0,
    weight: 0,
    hometown: '',
    date_of_birth: '',
    bio: '',
    portrait: '',
    is_active: true,
    is_coach: false
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setMemberData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const formattedData = {
      team_id: teamId,
      name: memberData.name,
      bio: memberData.bio,
      portrait: memberData.portrait,
      ...(memberType === 'roster'
        ? {
            position: memberData.position,
            height: Number(memberData.height),
            weight: Number(memberData.weight),
            hometown: memberData.hometown,
            date_of_birth: memberData.date_of_birth,
            is_active: memberData.is_active
          }
        : {
            job_title: memberData.job_title,
            is_coach: memberData.is_coach
          })
    };

    onAdd(formattedData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setMemberData({
      name: '',
      position: '',
      job_title: '',
      height: 0,
      weight: 0,
      hometown: '',
      date_of_birth: '',
      bio: '',
      portrait: '',
      is_active: true,
      is_coach: false
    });
    setMemberType('roster');
  };

  const isFormValid = () => {
    const commonFields =
      memberData.name && memberData.bio && memberData.portrait;

    if (memberType === 'roster') {
      return (
        commonFields &&
        memberData.position &&
        memberData.height > 0 &&
        memberData.weight > 0 &&
        memberData.hometown &&
        memberData.date_of_birth
      );
    }

    return commonFields && memberData.job_title;
  };

  const renderCommonFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={memberData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="col-span-3"
          placeholder="Enter name"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="bio" className="text-right">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={memberData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="col-span-3"
          placeholder="Enter bio"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="portrait" className="text-right">
          Portrait URL
        </Label>
        <Input
          id="portrait"
          value={memberData.portrait}
          onChange={(e) => handleInputChange('portrait', e.target.value)}
          className="col-span-3"
          placeholder="Enter portrait URL"
        />
      </div>
    </>
  );

  const renderRosterFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="position" className="text-right">
          Position
        </Label>
        <Select
          value={memberData.position}
          onValueChange={(value) => handleInputChange('position', value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {RUGBY_POSITIONS.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="height" className="text-right">
          Height (cm)
        </Label>
        <Input
          id="height"
          type="number"
          value={memberData.height || ''}
          onChange={(e) => handleInputChange('height', Number(e.target.value))}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="weight" className="text-right">
          Weight (kg)
        </Label>
        <Input
          id="weight"
          type="number"
          value={memberData.weight || ''}
          onChange={(e) => handleInputChange('weight', Number(e.target.value))}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="hometown" className="text-right">
          Hometown
        </Label>
        <Input
          id="hometown"
          value={memberData.hometown}
          onChange={(e) => handleInputChange('hometown', e.target.value)}
          className="col-span-3"
          placeholder="Enter hometown"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date_of_birth" className="text-right">
          Date of Birth
        </Label>
        <Input
          id="date_of_birth"
          type="date"
          value={memberData.date_of_birth}
          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="is_active" className="text-right">
          Active
        </Label>
        <div className="col-span-3">
          <Switch
            id="is_active"
            checked={memberData.is_active}
            onCheckedChange={(checked) =>
              handleInputChange('is_active', checked)
            }
          />
        </div>
      </div>
    </>
  );

  const renderStaffFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="job_title" className="text-right">
          Job Title
        </Label>
        <Input
          id="job_title"
          value={memberData.job_title}
          onChange={(e) => handleInputChange('job_title', e.target.value)}
          className="col-span-3"
          placeholder="Enter job title"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="is_coach" className="text-right">
          Is Coach
        </Label>
        <div className="col-span-3">
          <Switch
            id="is_coach"
            checked={memberData.is_coach}
            onCheckedChange={(checked) =>
              handleInputChange('is_coach', checked)
            }
          />
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-foreground">
            Add New Member
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="member-type" className="text-right">
              Member Type
            </Label>
            <Select
              value={memberType}
              onValueChange={(value: MemberType) => setMemberType(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select member type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roster">Player</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderCommonFields()}
          {memberType === 'roster' ? renderRosterFields() : renderStaffFields()}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground"
            disabled={!isFormValid()}
          >
            Add Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
