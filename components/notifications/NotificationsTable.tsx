'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import NotifcationsHeader from './NotificationsHeader';
import { toast } from '../ui/use-toast';
import ModalComponent from './ModalComponent';
import NotificationComponent from './NotificationComponent';
import { MessageConfig } from '@/types';
import { NextResponse } from 'next/server';


interface NotifcationWithStatus extends MessageConfig {
  createdAt: string | number | Date;
  createdBy: string;
  status: "scheduled" | "draft" | "failed" | "active" | "completed" | "canceled" | "completed";
}

const initialNotifications: NotifcationWithStatus[] = [
  {
    modalType: 'modal',
    textColor: '#000000',
    title: 'Back of the Year 2024',
    body: 'Reece MacDonald: Major League Rugby Back of the Year 2024',
    imageUrl: 'https://freejacks.com/wp-content/uploads/2024/08/Reece-1.jpg',
    buttonText: 'Share',
    buttonBackground: '#fb0055',
    buttonTextColor: '#ffffff',
    topic: 'miscellaneous',
    status: 'draft',
    teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    timezone: 'America/New_York',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'John Doe',
  },
  // Add more initial notifications if needed
];

const NotificationsTable: React.FC = () => {
  const [notifications, setNotifications] = useState<NotifcationWithStatus[]>(initialNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNotication, setselectedNotication] = useState<NotifcationWithStatus | null>(null);
  const [isAddScreenOpen, setIsAddScreenOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<'push' | 'modal' | null>(null);
  const handleNotificationSent = (status: "scheduled" | "draft" | "failed" | "active" | "canceled" | "completed", notificationIndex: number) => {
    setNotifications(prev => prev.map((notif, index) =>
      index === notificationIndex ? { ...notif, status } : notif
    ));
  };

  const handleEdit = (notification: NotifcationWithStatus) => {
    setselectedNotication(notification);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setIsAddScreenOpen(true);
  };

  const handleAddOption = (option: 'push' | 'modal') => {
    setSelectedOption(option);
    setIsAddScreenOpen(false);
    setIsDialogOpen(true);
  };

  const handleSave = (updatedNotification: MessageConfig) => {
    if (selectedNotication) {
      // Edit existing notification
      setNotifications(prev =>
        prev.map(notif => (notif === selectedNotication ? {
          ...updatedNotification,
          status: notif.status,
          modalType: updatedNotification.modalType.charAt(0).toUpperCase() + updatedNotification.modalType.slice(1),
          expirationDate: updatedNotification.expirationDate || new Date().toISOString(),
          createdBy: notif.createdBy,
          createdAt: notif.createdAt
        } as NotifcationWithStatus : notif))
      );
    } else {
      // Add new notification
      setNotifications(prev => [...prev, {
        ...updatedNotification,
        status: 'draft',
        modalType: updatedNotification.modalType.charAt(0).toUpperCase() + updatedNotification.modalType.slice(1),
        expirationDate: updatedNotification.expirationDate || new Date().toISOString(),
        createdBy: 'Current User', // Replace with actual user name or ID
        createdAt: new Date().toISOString()
      } as NotifcationWithStatus]);
    }
    setIsDialogOpen(false);
    setSelectedOption(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOption(null);
  };

  const handleSend = async (notification: NotifcationWithStatus, index: number) => {
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
          modalType: notification.modalType.charAt(0).toUpperCase() + notification.modalType.slice(1), // Capitalize first letter
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



      handleNotificationSent('active', index);
      // NextResponse.json() is removed as it's not applicable in this context
    } catch (error) {
      console.error('Error sending in-app modal:', error);
      if (error instanceof Error) {
        handleNotificationSent('failed', index);
      } else {
        handleNotificationSent('failed', index);
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
                <TableHead>Layout</TableHead>
                <TableHead>Send Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification, index) => (
                <TableRow key={index}>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell>{notification.modalType}</TableCell>
                  <TableCell>{notification.expirationDate ?
                    <span suppressHydrationWarning>
                      {new Date(notification.expirationDate).toLocaleString()}
                    </span>
                    : 'N/A'}
                  </TableCell>
                  <TableCell>{notification.status}</TableCell>
                  <TableCell>{notification.createdBy}</TableCell>
                  <TableCell>
                    <span suppressHydrationWarning>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(notification)} variant="outline" className="mr-2">
                      Edit
                    </Button>
                    <Button onClick={() => handleSend(notification, index)} variant="default">
                      Send Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <Dialog open={isAddScreenOpen} onOpenChange={setIsAddScreenOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Choose Notification Type</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => handleAddOption('push')}>
                Push Notification
              </Button>
              <Button onClick={() => handleAddOption('modal')}>
                Modal
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:min-w-[800px] shadow-lg border-white">
            <DialogHeader>
              <DialogTitle>{selectedNotication ? 'Edit In-App Notification' : 'Add In-App Notification'}</DialogTitle>
            </DialogHeader>
            {selectedOption === 'push' ? (
              <NotificationComponent />
            ) : (
              <ModalComponent
                config={selectedNotication as MessageConfig}
                onSave={(updatedConfig: MessageConfig) => {
                  handleSave(updatedConfig);
                  handleCloseDialog();
                }}
                teamId="034db172-942f-48b8-bc91-a0b3eb3a025f"
                onNotificationSent={(status: "scheduled" | "draft" | "failed" | "active" | "completed" | "canceled") =>
                  handleNotificationSent(status, notifications.indexOf(selectedNotication!))
                }
              />
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default NotificationsTable;