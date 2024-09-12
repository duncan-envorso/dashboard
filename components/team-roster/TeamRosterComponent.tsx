'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Player, positionGroups } from '@/public/data/team'

interface TeamRosterDashboardProps {
    initialPlayers: Player[]
}

export default function TeamRosterDashboard({ initialPlayers }: TeamRosterDashboardProps) {
    const [players, setPlayers] = useState<Player[]>([])
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setPlayers(initialPlayers)
        setIsLoading(false)
    }, [initialPlayers])

    const handleEdit = (player: Player) => {
        setEditingPlayer({ ...player })
    }

    const handleSave = () => {
        if (editingPlayer) {
            setPlayers(players.map(p => p.id === editingPlayer.id ? editingPlayer : p))
            setEditingPlayer(null)
        }
    }

    const handleInputChange = (field: keyof Player, value: string | number) => {
        if (editingPlayer) {
            setEditingPlayer({ ...editingPlayer, [field]: value })
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4 bg-background h-screen flex flex-col">
            <h1 className="text-4xl font-bold text-navy mb-8">Team Roster Dashboard</h1>
            <ScrollArea className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                    {players.length > 0 ? (
                        players.map(player => (
                            <Card key={player.id} className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="relative">
                                    <Image
                                        priority
                                        src={player.portrait}
                                        alt={`Portrait of ${player.name}`}
                                        width={300}
                                        height={400}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <CardTitle className="text-2xl font-bold mb-1">{player.name}</CardTitle>
                                        <Badge variant="secondary" className="text-sm mb-2">{player.position}</Badge>
                                        <div className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="text-gray-300">Position Group</p>
                                                <p className="font-semibold">{positionGroups[player.position_group_id as keyof typeof positionGroups]}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-300">Height / Weight</p>
                                                <p className="font-semibold">{player.height}cm / {player.weight}kg</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="bg-navy text-white w-full" onClick={() => handleEdit(player)}>Edit Player</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] bg-white">
                                            <DialogHeader>
                                                <DialogTitle>Edit Player: {editingPlayer?.name}</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={editingPlayer?.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="position" className="text-right">
                                                        Position
                                                    </Label>
                                                    <Input
                                                        id="position"
                                                        value={editingPlayer?.position}
                                                        onChange={(e) => handleInputChange('position', e.target.value)}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="position_group" className="text-right">
                                                        Group
                                                    </Label>
                                                    <Select
                                                        value={editingPlayer?.position_group_id}
                                                        onValueChange={(value) => handleInputChange('position_group_id', value)}
                                                    >
                                                        <SelectTrigger className="col-span-3">
                                                            <SelectValue placeholder="Select position group" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(positionGroups).map(([id, name]) => (
                                                                <SelectItem key={id} value={id}>{name}</SelectItem>
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
                                                        value={editingPlayer?.height}
                                                        onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
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
                                                        value={editingPlayer?.weight}
                                                        onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button onClick={handleSave} className="btn-secondary">Save Changes</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>No players available.</p>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}