'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Notification } from '@/types'
import { useNotifications } from '@/app/contexts/NotifcationsContext'
import { NextResponse } from 'next/server'

interface EditNotificationModalProps {
  notification: Notification | null
  onClose: () => void
}

export default function EditNotificationModal({ notification, onClose }: EditNotificationModalProps) {
  const { updateNotification,getNotification } = useNotifications()
  const [editedNotification, setEditedNotification] = useState<Notification | null>(notification)

  useEffect(() => {
    setEditedNotification(notification)
  }, [notification])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNotification(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editedNotification) {
      try {
        console.log("Checking if notification exists:", editedNotification.id);
        const existingNotification = await getNotification(editedNotification.id);
        if (!existingNotification) {
          throw new Error("Notification not found");
        }
        console.log("Existing notification:", existingNotification);
        
        console.log("Submitting edited notification:", editedNotification);
        await updateNotification(editedNotification.id, editedNotification)
        onClose()
      } catch (error) {
        console.error("Error updating notification:", error)
        // Optionally, show an error message to the user
      }
    }
  }

  return (
    <Dialog open={!!notification} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Notification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                name="title"
                value={editedNotification?.title || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            {/* Add more fields as needed */}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}