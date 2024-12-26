'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AddMemberDialog } from './AddMemberDialog';
import { currentTeamConfig } from '@/teamConfig';
import { useSession } from 'next-auth/react';
import { CombinedTeamData, RosterMember, StaffMember } from '@/types/team';
import EditTeamMemberForm from './EditTeamMemberForm';
import { toast } from '../ui/use-toast';

interface TeamRosterDashboardProps {
  apiFormattedData: CombinedTeamData;
}

const positionGroups = {
  all: 'All Members',
  roster: 'Players',
  staff: 'Staff'
};

export default function TeamRosterDashboard({
  apiFormattedData
}: TeamRosterDashboardProps) {
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
  const teamId = currentTeamConfig.teamId;
  const { data: session } = useSession();

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

    const endpoint =
      'is_coach' in memberData
        ? `https://api.seawolves.envorso.com/v1/teams/${teamId}/staff`
        : `https://api.seawolves.envorso.com/v1/teams/${teamId}/roster`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          team_id: teamId,
          ...memberData
        })
      });

      if (response.ok) {
        setIsAddDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Member added successfully',
          variant: 'default'
        });
      } else {
        const errorData = await response.json();
        console.log('Failed to add member:', errorData);
        toast({
          title: 'Error',
          description: 'Failed to add member',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log('Error adding member:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!session?.accessToken || !deletingMember) return;

    const endpoint = `https://api.seawolves.envorso.com/v1/teams/${teamId}/${
      'is_coach' in deletingMember ? 'staff' : 'roster'
    }/${deletingMember.id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Member deleted successfully'
        });
        return;
      }

      toast({
        title: 'Error',
        description: 'Failed to delete member',
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const filteredMembers = useMemo(() => {
    const { roster = [], staff = [] } = apiFormattedData;

    switch (activeTab) {
      case 'all':
        return [...roster, ...staff];
      case 'roster':
        return roster;
      case 'staff':
        return staff;
    }
  }, [apiFormattedData, activeTab]);

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
                  {member.height}cm / {member.weight}kg
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
          Edit Member
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
          Delete Member
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
          {editingMember && (
            <EditTeamMemberForm
              type={'position' in editingMember ? 'roster' : 'staff'}
              initialData={editingMember}
              teamId={teamId}
              onSuccess={() => {
                setIsEditDialogOpen(false);
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
