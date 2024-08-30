'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NotificationsComponent, { MessageConfig } from './NotificationsComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusIcon } from 'lucide-react';
import NotifcationsHeader from './NotificationsHeader';

const initialNotifications: MessageConfig[] = [
  {
    layout: 'modal',
    textColor: '#000000',
    title: 'Back of the Year 2024',
    body: 'Reece MacDonald: Major League Rugby Back of the Year 2024',
    imageUrl: 'https://freejacks.com/wp-content/uploads/2024/08/Reece-1.jpg',
    buttonText: 'Share',
    buttonBackground: '#fb0055',
    buttonTextColor: '#ffffff',
  },
  // Add more initial notifications if needed
];

type HandleAddFunction = () => void;


const NotificationsTable: React.FC = () => {
  const [notifications, setNotifications] = useState<MessageConfig[]>(initialNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<MessageConfig | null>(null);

  const handleEdit = (notification: MessageConfig) => {
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
        prev.map(notif => (notif === selectedNotification ? updatedNotification : notif))
      );
    } else {
      // Add new notification
      setNotifications(prev => [...prev, updatedNotification]);
    }
    setIsDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <NotifcationsHeader handleAdd={handleAdd} />
    <Card className='m-5' >

      <CardHeader>
        <CardTitle>Notifcations</CardTitle>
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
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification, index) => (
              <TableRow key={index}>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.buttonText}</TableCell>
                <TableCell>{notification.layout}</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(notification)} variant="outline">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent >

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
              imageUrl: '',
              buttonText: '',
              buttonBackground: '#fb0055',
              buttonTextColor: '#ffffff',
            }}
            onSave={(updatedConfig: MessageConfig) => {
              handleSave(updatedConfig);
              handleCloseDialog();
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
    </div>
  );
};

export default NotificationsTable;
