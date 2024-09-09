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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-navy text-navy dark:text-white p-6 rounded-lg shadow-md">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-navy dark:text-white">Configure Push Notification</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-navy dark:text-white">Title</Label>
            <Input
              id="title"
              name="title"
              value={config.title}
              onChange={handleInputChange}
              placeholder="Notification Title"
              className="border-green focus:ring-green dark:bg-navy-light dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="body" className="text-navy dark:text-white">Body</Label>
            <Textarea
              id="body"
              name="body"
              value={config.body}
              onChange={handleInputChange}
              placeholder="Notification Body"
              rows={3}
              className="border-green focus:ring-green dark:bg-navy-light dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="icon" className="text-navy dark:text-white">Icon URL</Label>
            <Input
              id="icon"
              name="icon"
              value={config.icon}
              onChange={handleInputChange}
              placeholder="https://example.com/icon.png"
              className="border-green focus:ring-green dark:bg-navy-light dark:text-white"
            />
          </div>
          <Button onClick={handleSave} className="bg-green hover:bg-green-dark text-white">Save Notification</Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-navy dark:text-white">Preview</h3>
        <Card className="bg-white dark:bg-navy-light border-green">
          <CardHeader className="flex flex-row items-center gap-4">
            {config.icon && (
              <Image src={config.icon} alt="Notification Icon" width={48} height={48} className="rounded-full" />
            )}
            <CardTitle className="text-navy dark:text-white">{config.title || 'Notification Title'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-navy dark:text-white">{config.body || 'Notification body will appear here'}</p>
          </CardContent>
        </Card>
        <div className="mt-4 flex items-center gap-2 text-sm text-green dark:text-green-light">
          <Bell size={16} />
          <span>This is how the notification will appear on most devices</span>
        </div>
      </div>
    </div>
  )
}