'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from 'lucide-react'
import Image from 'next/image'

interface NotificationConfig {
  title: string
  body: string
  icon: string
}

export default function NotificationComponent() {
  const [config, setConfig] = useState<NotificationConfig>({
    title: '',
    body: '',
    icon: '/placeholder.svg?height=50&width=50'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log('Saving notification:', config)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configure Push Notification</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={config.title}
              onChange={handleInputChange}
              placeholder="Notification Title"
            />
          </div>
          <div>
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              name="body"
              value={config.body}
              onChange={handleInputChange}
              placeholder="Notification Body"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="icon">Icon URL</Label>
            <Input
              id="icon"
              name="icon"
              value={config.icon}
              onChange={handleInputChange}
              placeholder="https://example.com/icon.png"
            />
          </div>
          <Button onClick={handleSave}>Save Notification</Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            {config.icon && (
              <Image src={config.icon} alt="Notification Icon" className="w-12 h-12 rounded-full" />
            )}
            <CardTitle>{config.title || 'Notification Title'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{config.body || 'Notification body will appear here'}</p>
          </CardContent>
        </Card>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Bell size={16} />
          <span>This is how the notification will appear on most devices</span>
        </div>
      </div>
    </div>
  )
}