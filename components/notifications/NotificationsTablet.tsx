'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NotificationsComponent, { MessageConfig } from './NotificationsComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import NotifcationsHeader from './NotificationsHeader';
import { toast } from '../ui/use-toast';

interface NotificationWithStatus extends MessageConfig {
  status: string | null;
}

const initialNotifications: NotificationWithStatus[] = [
  {
    layout: 'modal',
    textColor: '#000000',
    title: 'Back of the Year 2024',
    body: 'Reece MacDonald: Major League Rugby Back of the Year 2024',
    imageUrl: 'https://freejacks.com/wp-content/uploads/2024/08/Reece-1.jpg',
    buttonText: 'Share',
    buttonBackground: '#fb0055',
    buttonTextColor: '#ffffff',
    topic: 'miscelaneous',
    status: null,
  },
  // Add more initial notifications if needed
];

const NotificationsTable: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationWithStatus[]>(initialNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationWithStatus | null>(null);

  const handleNotificationSent = (status: string, notificationIndex: number) => {
    setNotifications(prev => prev.map((notif, index) => 
      index === notificationIndex ? { ...notif, status } : notif
    ));
  };

  const handleEdit = (notification: NotificationWithStatus) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedNotification(null);
    setIsDialogOpen(true);
  };

  const handleSave = (updatedNotification: MessageConfig) => {
    if (selectedNotification) {
      // Edit existing notification
      setNotifications(prev =>
        prev.map(notif => (notif === selectedNotification ? { ...updatedNotification, status: notif.status } : notif))
      );
    } else {
      // Add new notification
      setNotifications(prev => [...prev, { ...updatedNotification, status: null }]);
    }
    setIsDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSend = async (notification: NotificationWithStatus, index: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_NOTIFICATION_KEY;
      if (!apiKey) {
        throw new Error('API key is missing');
      }

      const response = await fetch('https://api.seawolves.envorso.com/v1/panel/notifications?teamId=034db172-942f-48b8-bc91-a0b3eb3a025f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          title: notification.title,
          body: notification.body,
          topic: notification.topic,
          key: 'ENVORSO_HAS_THE_HIGHEST_SECURITY_KEY_EVER_$123&&'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send notification: ${response.status} ${response.statusText}. ${errorText}`);
      }

      toast({
        title: 'Notification sent successfully',
        description: 'Your notification has been sent to the app',
      });

      handleNotificationSent('Sent successfully', index);
    } catch (error) {
      if (error instanceof Error) {
        handleNotificationSent(`Failed: ${error.message}`, index);
      } else {
        handleNotificationSent('Failed: An unknown error occurred', index);
      }
    }
  };

  return (
    <div>
      <NotifcationsHeader handleAdd={handleAdd} />
      <Card className='m-5'>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Create Notifications to push to the app</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Button Text</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification, index) => (
                <TableRow key={index}>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell>{notification.buttonText}</TableCell>
                  <TableCell>{notification.layout}</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell>{notification.status || 'Not sent'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(notification)} variant="outline" className="mr-2">
                      Edit
                    </Button>
                    <Button onClick={() => handleSend(notification, index)} variant="default">
                      Send
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedNotification ? 'Edit Notification' : 'Add Notification'}</DialogTitle>
            </DialogHeader>
            <NotificationsComponent
              config={selectedNotification || {
                layout: 'modal',
                textColor: '#000000',
                title: '',
                body: '',
                topic: '',
                imageUrl: '',
                buttonText: '',
                buttonBackground: '#fb0055',
                buttonTextColor: '#ffffff',
              }}
              onSave={(updatedConfig: MessageConfig) => {
                handleSave(updatedConfig);
                handleCloseDialog();
              }}
              teamId="034db172-942f-48b8-bc91-a0b3eb3a025f"
              onNotificationSent={(status: string) => handleNotificationSent(status, notifications.indexOf(selectedNotification!))}
            />
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default NotificationsTable;