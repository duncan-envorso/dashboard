'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AddMemberDialog } from './AddMemberDialog';
import { currentTeamConfig } from '@/teamConfig';
import { useSession } from 'next-auth/react';
import { CombinedTeamData, RosterMember, StaffMember } from '@/types/team';
import EditTeamMemberForm from './EditTeamMemberForm';
import { toast } from '../ui/use-toast';
import { upsertTeamMember, deleteMember } from '@/app/actions'; // Import server actions

interface TeamRosterDashboardProps {
  apiFormattedData: CombinedTeamData;
  onMemberChange?: () => void; // Add callback for data updates
}

const positionGroups = {
  all: 'All Members',
  roster: 'Players',
  staff: 'Staff'
};

export default function TeamRosterDashboard({
  apiFormattedData,
  onMemberChange
}: TeamRosterDashboardProps) {
  const router = useRouter();
  const [editingMember, setEditingMember] = useState<
    RosterMember | StaffMember | null
  >(null);
  const [deletingMember, setDeletingMember] = useState<
    RosterMember | StaffMember | null
  >(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const teamId = currentTeamConfig.teamId;
  const { data: session } = useSession();

  // Helper function to convert height from cm to feet and inches
  const convertHeightToFeetAndInches = (heightInCm: number): string => {
    const inches = heightInCm * 0.393701;
    const feet = Math.floor(inches / 12);
    const inchesRemaining = Math.round(inches % 12);
    return `${feet}'${inchesRemaining}"`;
  };

  // Helper function to convert weight from kg to lbs
  const convertWeightToPounds = (weightInKg: number): string => {
    const pounds = Math.round(weightInKg * 2.20462);
    return pounds.toString();
  };

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddMember = async (
    memberData: Partial<RosterMember | StaffMember>
  ) => {
    if (!session?.accessToken) {
      toast({
        title: 'Error',
        description: 'No access token available',
        variant: 'destructive'
      });
      return;
    }

    try {
      const type = 'is_coach' in memberData ? 'staff' : 'roster';
      await upsertTeamMember({
        teamId,
        type,
        data: {
          team_id: teamId,
          ...memberData
        },
        token: session.accessToken
      });

      setIsAddDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Member added successfully',
        variant: 'default'
      });

      // Trigger both router refresh and callback
      router.refresh();
      onMemberChange?.();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!session?.accessToken || !deletingMember) return;

    try {
      // You'll need to add a deleteMember server action to your actions.ts file
      await deleteMember({
        teamId,
        memberId: deletingMember.id as string,
        type: 'is_coach' in deletingMember ? 'staff' : 'roster',
        token: session.accessToken
      });

      setIsDeleteDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Member deleted successfully'
      });

      // Trigger both router refresh and callback
      router.refresh();
      onMemberChange?.();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const filteredMembers = useMemo(() => {
    const { roster = [], staff = [] } = apiFormattedData;

    // First filter by tab
    let filtered: any[] = [];
    switch (activeTab) {
      case 'all':
        filtered = [...roster, ...staff];
        break;
      case 'roster':
        filtered = roster;
        break;
      case 'staff':
        filtered = staff;
        break;
      default:
        filtered = [];
    }

    // Then filter by search query if it exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return filtered.filter((member) => {
        const name = member.name.toLowerCase();
        const position = (
          'position' in member ? member.position : member.job_title
        ).toLowerCase();
        return name.includes(query) || position.includes(query);
      });
    }

    return filtered;
  }, [apiFormattedData, activeTab, searchQuery]);

  const handleEdit = (member: RosterMember | StaffMember) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const renderCard = (member: RosterMember | StaffMember) => (
    <Card
      key={member.id}
      className="overflow-hidden bg-card shadow-lg transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative min-h-96">
        <Image
          src={member.portrait || '/placeholder-image.jpg'}
          alt={`Portrait of ${member.name}`}
          fill
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <CardTitle className="mb-1 text-2xl font-bold">
            {member.name}
          </CardTitle>
          <Badge variant="secondary" className="mb-2 text-sm">
            {'position' in member ? member.position : member.job_title}
          </Badge>
          {'height' in member && 'weight' in member && (
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-300">Height / Weight</p>
                <p className="font-semibold">
                  {convertHeightToFeetAndInches(member.height)} /{' '}
                  {convertWeightToPounds(member.weight)}lbs
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <CardContent className="space-y-2 p-4">
        <Button
          className="w-full bg-primary text-primary-foreground"
          onClick={() => handleEdit(member)}
        >
          Edit {member.name}`&apos;s Info
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            setDeletingMember(member);
            setIsDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            Team Roster Dashboard
          </h1>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add Member
          </Button>

          <AddMemberDialog
            isOpen={isAddDialogOpen}
            teamId={teamId}
            onClose={() => setIsAddDialogOpen(false)}
            onAdd={handleAddMember}
          />
        </div>

        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              className="w-full pl-10 pr-4"
              placeholder="Search by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex space-x-2 bg-slate-100">
            {Object.entries(positionGroups).map(([id, name]) => (
              <TabsTrigger
                key={id}
                value={id}
                className="rounded-md px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {filteredMembers?.map(renderCard)}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogTitle className="hidden">Edit Member</DialogTitle>
          {editingMember && (
            <EditTeamMemberForm
              type={'position' in editingMember ? 'roster' : 'staff'}
              initialData={editingMember}
              teamId={teamId}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                router.refresh();
                onMemberChange?.();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingMember?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
