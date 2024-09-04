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
    topic: 'miscellaneous',
    status: null,
    teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
    modalType: 'Modal',
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
        prev.map(notif => (notif === selectedNotification ? { 
          ...updatedNotification, 
          status: notif.status,
          modalType: updatedNotification.layout.charAt(0).toUpperCase() + updatedNotification.layout.slice(1),
          expirationDate: updatedNotification.expirationDate || new Date().toISOString()
        } as NotificationWithStatus : notif))
      );
    } else {
      // Add new notification
      setNotifications(prev => [...prev, { 
        ...updatedNotification, 
        status: null,
        modalType: updatedNotification.layout.charAt(0).toUpperCase() + updatedNotification.layout.slice(1),
        expirationDate: updatedNotification.expirationDate || new Date().toISOString()
      } as NotificationWithStatus]);
    }
    setIsDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSend = async (notification: NotificationWithStatus, index: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_NOTIFICATION_KEY;
      const teamId = "034db172-942f-48b8-bc91-a0b3eb3a025f"; // Hardcoded teamId
      if (!apiKey) {
        throw new Error('API key is missing');
      }

      const response = await fetch('https://api.seawolves.envorso.com/v1/panel/in-app-modal?teamId=3fa85f64-5717-4562-b3fc-2c963f66afa6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId: teamId,
          modalType: notification.layout.charAt(0).toUpperCase() + notification.layout.slice(1), // Capitalize first letter
          expirationDate: notification.expirationDate,
          title: notification.title,
          image_url: notification.imageUrl,
          body: notification.body,
          button_text: notification.buttonText,
          text_color: notification.textColor,
          background_color: notification.buttonBackground,
          button_text_color: notification.buttonTextColor,
          button_background_color: notification.buttonBackground
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send in-app modal: ${response.status} ${response.statusText}. ${errorText}`);
      }

      toast({
        title: 'In-app modal sent successfully',
        description: 'Your in-app modal has been sent to the app',
      });

      handleNotificationSent('Sent successfully', index);
    } catch (error) {
      console.error('Error sending in-app modal:', error);
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
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>Create and manage in-app notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Button Text</TableHead>
                <TableHead>Layout Type</TableHead>
                <TableHead>Expiration Date</TableHead>
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
                  <TableCell>{notification.expirationDate ? 
                    // Use a client-side only rendering for the date
                    <span suppressHydrationWarning>
                      {new Date(notification.expirationDate).toLocaleString()}
                    </span> 
                    : 'N/A'}
                  </TableCell>
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
              <DialogTitle>{selectedNotification ? 'Edit In-App Notification' : 'Add In-App Notification'}</DialogTitle>
            </DialogHeader>
            <NotificationsComponent
              config={selectedNotification as MessageConfig}
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