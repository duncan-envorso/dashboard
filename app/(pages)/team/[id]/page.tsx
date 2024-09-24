import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiFormattedData } from '@/public/data/team'

interface Player {
    id: string;
    name: string;
    position: string;
    position_group_id: number;
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
    thumbnail: string;
}

interface Staff {
    id: number;
    name: string;
    job_title: string;
    portrait: string;
    thumbnail: string;
}

type RosterMember = Player | Coach | Staff;

async function getRosterMember(id: string): Promise<RosterMember | null> {
    const mockData = apiFormattedData;
    
    const allMembers = [...mockData.players, ...mockData.coaches, ...mockData.staff];
    return allMembers.find(member => member.id.toString() === id) || null;
}

export default async function RosterMemberProfile({ params }: { params: { id: string } }) {
    const member = await getRosterMember(params.id);

    if (!member) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-6 flex flex-col md:flex-row">
                    <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                        <Image
                            src={member.portrait}
                            alt={`Portrait of ${member.name}`}
                            width={300}
                            height={400}
                            objectFit="cover"
                            className="rounded-lg w-full h-auto"
                        />
                    </div>
                    <div className="md:w-2/3">
                        <h2 className="text-3xl font-bold mb-2">{member.name}</h2>
                        <Badge variant="secondary" className="text-lg mb-4">
                            {'position' in member ? member.position : member.job_title}
                        </Badge>
                        
                        {'position' in member ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500">Height</p>
                                    <p className="font-semibold">{member.height} cm</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Weight</p>
                                    <p className="font-semibold">{member.weight} kg</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Position Group</p>
                                    <p className="font-semibold">
                                        {member.position_group_id === 1 ? "Forward" :
                                         member.position_group_id === 2 ? "Back" :
                                         member.position_group_id === 3 ? "Specialist" : "Unknown"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-500">Role</p>
                                <p className="font-semibold">{member.job_title}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}