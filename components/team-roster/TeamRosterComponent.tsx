'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from 'lucide-react'

interface Player {
    id: string;
    name: string;
    position: string;
    position_group_id: number | null;
    height: number;
    weight: number;
    portrait: string;
    thumbnail: string;
}

interface Coach {
    id: number;
    name: string;
    job_title: string;
    portrait: string;
}

interface TeamData {
    players: Player[];
    coaches: Coach[];

}

interface TeamRosterDashboardProps {
    apiFormattedData: TeamData;
}

const positionGroups = {
    'all': 'All Members',
    'players': 'Players',
    'coaches': 'Coaches',
  
};

export default function TeamRosterDashboard({ apiFormattedData }: TeamRosterDashboardProps) {
    const [editingMember, setEditingMember] = useState<Player | Coach | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('all')

    const filteredMembers = useMemo(() => {
        const { players = [], coaches = [] } = apiFormattedData;

        switch (activeTab) {
            case 'all':
                return [...players, ...coaches];
            case 'players':
                return players;
            case 'coaches':
                return coaches;
            // Removed unreachable return statement
        }
    }, [apiFormattedData, activeTab]);

    const handleEdit = (member: Player | Coach) => {
        setEditingMember(member)
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        // Implement save functionality
        setIsDialogOpen(false)
        setEditingMember(null)
    }

    const handleInputChange = (field: string, value: string | number) => {
        if (editingMember) {
            setEditingMember({ ...editingMember, [field]: value })
        }
    }

    const handleAdd = () => {
        // Implement add functionality
        console.log('Add new member')
    }

    const renderCard = (member: Player | Coach) => (
        <Card key={member.id} className="overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                    <CardTitle className="text-2xl font-bold mb-1">{member.name}</CardTitle>
                    <Badge variant="secondary" className="text-sm mb-2">
                        {'position' in member ? member.position : member.job_title}
                    </Badge>
                    {'height' in member && 'weight' in member && (
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <p className="text-gray-300">Height / Weight</p>
                                <p className="font-semibold">{member.height}cm / {member.weight}kg</p>
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
        <div className="bg-slate-100 min-h-screen">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Team Roster Dashboard</h1>
                    <Button onClick={handleAdd} className="bg-primary text-primary-foreground">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-slate-100 mb-4 flex space-x-2">
                        {Object.entries(positionGroups).map(([id, name]) => (
                            <TabsTrigger
                                key={id}
                                value={id}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md"
                            >
                                {name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value={activeTab} className="mt-4">
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-6">
                                {filteredMembers?.map(renderCard)}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-bold">
                            Edit Member: {editingMember?.name || 'Unknown'}
                        </DialogTitle>
                    </DialogHeader>
                    {editingMember ? (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
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
                                        <Label htmlFor="position" className="text-right">Position</Label>
                                        <Input
                                            id="position"
                                            value={editingMember.position}
                                            onChange={(e) => handleInputChange('position', e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="height" className="text-right">Height (cm)</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            value={editingMember.height}
                                            onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="weight" className="text-right">Weight (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            value={editingMember.weight}
                                            onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                                            className="col-span-3"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="job_title" className="text-right">Job Title</Label>
                                    <Input
                                        id="job_title"
                                        value={(editingMember as Coach).job_title}
                                        onChange={(e) => handleInputChange('job_title', e.target.value)}
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
    )
}