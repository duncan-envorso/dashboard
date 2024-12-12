'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { AddMemberDialog } from './AddMemberDialog';
import { currentTeamConfig } from '@/teamConfig';
import { useSession } from 'next-auth/react';
import { CombinedTeamData, RosterMember, StaffMember } from '@/types/team';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      console.log('No access token available');
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
        console.log('Member added successfully');
        setIsAddDialogOpen(false);
        // You might want to refresh your data here
      } else {
        const errorData = await response.json();
        console.log('Failed to add member:', errorData);
      }
    } catch (error) {
      console.log('Error adding member:', error);
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
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingMember || !session?.accessToken) return;

    const endpoint =
      'is_coach' in editingMember
        ? `https://api.seawolves.envorso.com/v1/teams/${teamId}/staff/${editingMember.team_id}`
        : `https://api.seawolves.envorso.com/v1/teams/${teamId}/roster/${editingMember.team_id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(editingMember)
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setEditingMember(null);
        // You might want to refresh your data here
      }
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (editingMember) {
      setEditingMember({ ...editingMember, [field]: value });
    }
  };

  const renderCard = (member: RosterMember | StaffMember) => (
    <Card
      key={member.team_id}
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
      <CardContent className="p-4">
        <Button
          className="w-full bg-primary text-primary-foreground"
          onClick={() => handleEdit(member)}
        >
          Edit Member
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-foreground">
              Edit Member: {editingMember?.name || 'Unknown'}
            </DialogTitle>
          </DialogHeader>
          {editingMember ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingMember.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>
              {'position' in editingMember ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">
                      Position
                    </Label>
                    <Input
                      id="position"
                      value={editingMember.position}
                      onChange={(e) =>
                        handleInputChange('position', e.target.value)
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="height" className="text-right">
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={editingMember.height}
                      onChange={(e) =>
                        handleInputChange('height', parseInt(e.target.value))
                      }
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
                      value={editingMember.weight}
                      onChange={(e) =>
                        handleInputChange('weight', parseInt(e.target.value))
                      }
                      className="col-span-3"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="job_title" className="text-right">
                    Job Title
                  </Label>
                  <Input
                    id="job_title"
                    value={(editingMember as StaffMember).job_title}
                    onChange={(e) =>
                      handleInputChange('job_title', e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              No member selected for editing.
            </div>
          )}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground"
              disabled={!editingMember}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
