'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye } from 'lucide-react'

interface Player {
    id: string;
    name: string;
    position: string;
    position_group_id: number | null;
    height: number;
    weight: number;
    portrait: string;
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

interface TeamRosterProps {
    apiFormattedData: TeamData;
}

const positionGroups = {
    "1": "Forward",
    "2": "Back",
    "3": "Specialist",
    "4": "Staff"
}

export default function TeamRosterView({ apiFormattedData }: TeamRosterProps) {
    const [activeTab, setActiveTab] = useState('all')

    const filteredMembers = useMemo(() => {
        const players = apiFormattedData?.players || []
        const coaches = apiFormattedData?.coaches || []
        const allMembers = [...players, ...coaches]

        if (activeTab === 'all') {
            return allMembers
        } else if (activeTab === 'coaches') {
            return coaches
        } else {
            return players.filter(player =>
                player.position_group_id === parseInt(activeTab)
            )
        }
    }, [apiFormattedData, activeTab])

    return (
        <div className="container mx-auto p-4">
            <div className="w-full bg-slate-100 border-none shadow-none">
                <h1 className="text-3xl font-bold text-foreground mb-6">Team Roster</h1>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-slate-100">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            All Members
                        </TabsTrigger>
                        {Object.entries(positionGroups).map(([id, name]) => (
                            <TabsTrigger
                                key={id}
                                value={id}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                {name}
                            </TabsTrigger>
                        ))}
                        <TabsTrigger
                            value="coaches"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Coaches
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab}>
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-6">
                                {filteredMembers.map((member) => (
                                    <Card 
                                        key={member.id} 
                                        className="overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <div className="relative">
                                            <Image
                                                src={member.portrait || '/placeholder-image.jpg'}
                                                alt={`Portrait of ${member.name}`}
                                                width={300}
                                                height={400}
                                                className="w-full h-auto object-cover"
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
                                            <Link href={'position' in member ? `/team/${member.id}` : `/coach/${member.id}`}>
                                                <Button className="w-full bg-primary text-primary-foreground">
                                                    <Eye className="mr-2 h-4 w-4" /> View Profile
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}