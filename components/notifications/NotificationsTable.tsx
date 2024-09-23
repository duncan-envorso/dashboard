'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NotifcationsHeader from './NotificationsHeader';
import { toast } from '../ui/use-toast';
import ModalComponent from './ModalComponent';
import NotificationComponent from './NotificationComponent';
import { MessageConfig } from '@/types';
import { Button } from "@/components/ui/button";
import NotificationsCard from './AllNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SentNotificationsTable from './CompletedNotifications';
import DraftNotifications from './DraftNotifications';
import ScheduledNotifications from './ScheduledNotifications';
import ActiveNotifications from './ActiveNotifications';
import Image from 'next/image';
import { Bell, LayoutTemplate } from 'lucide-react';
import NotificationTypeDialog from './NotifcationTypeDialog';



const NotificationsTable: React.FC = () => {
  const [notifications, setNotifications] = useState<MessageConfig[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNotication, setSelectedNotication] = useState<MessageConfig | null>(null);
  const [isAddScreenOpen, setIsAddScreenOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<'push' | 'Modal' | null>(null);

  const handleNotificationSent = (status: "Scheduled" | "Draft" | "Failed" | "Active" | "Canceled" | "Completed" | "Deleted", notificationIndex: number) => {
    setNotifications(prev => prev.map((notif, index) =>
      index === notificationIndex ? { ...notif, status: status as MessageConfig['status'] } : notif
    ));
  };



  const handleAdd = () => {
    setIsAddScreenOpen(true);
  };

  const handleAddOption = (option: 'push' | 'Modal') => {
    setSelectedOption(option);
    setIsAddScreenOpen(false);
    setIsDialogOpen(true);
  };

  const handleSave = async (updatedNotification: MessageConfig) => {
    try {
      const notificationToSave = {
        ...updatedNotification,
        status: 'Draft',
        modalType: updatedNotification.modalType as MessageConfig['modalType'],
        expirationDate: updatedNotification.expirationDate || new Date().toISOString(),
        scheduledDate: null,
        scheduledTime: null,
      };

      if (selectedNotication) {
        // Edit existing notification
        const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${selectedNotication.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTIFICATION_KEY}`,
          },
          body: JSON.stringify(notificationToSave),
        });

        if (!response.ok) {
          throw new Error('Failed to update notification');
        }

        const updatedNotif = await response.json();

        setNotifications(prev =>
          prev.map(notif => (notif.id === selectedNotication.id ? updatedNotif : notif))
        );

        toast({
          title: 'Notification updated successfully',
          description: 'Your notification has been updated and set to draft status',
        });
      } else {
        // Add new notification
        const response = await fetch('https://api.seawolves.envorso.com/v1/panel/in-app-modal?teamId=034db172-942f-48b8-bc91-a0b3eb3a025f', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTIFICATION_KEY}`,
          },
          body: JSON.stringify(notificationToSave),
        });

        if (!response.ok) {
          throw new Error('Failed to add notification');
        }

        const newNotif = await response.json();

        console.log("newNotif", newNotif)

        setNotifications(prev => [...prev, newNotif]);



        toast({
          title: 'Notification added successfully',
          description: 'Your new notification has been added as a draft',
        });
      }

      setIsDialogOpen(false);
      setSelectedOption(null);
    } catch (error) {
      console.error('Error saving notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOption(null);
  };

  const handleSend = async (notification: MessageConfig, index: number) => {
    console.log(notification);
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
          modalType: notification.modalType,

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

      handleNotificationSent('Scheduled', index);
    } catch (error) {
      console.error('Error sending in-app modal:', error);
      handleNotificationSent('Failed', index);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <NotifcationsHeader handleAdd={handleAdd} />
      <Tabs defaultValue="all">
        <TabsList className="bg-card">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Drafts
          </TabsTrigger>
          <TabsTrigger
            value="scheduled"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Scheduled
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Completed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <NotificationsCard />
        </TabsContent>
        <TabsContent value="completed">
          <SentNotificationsTable />
        </TabsContent>
        <TabsContent value="draft">
          <DraftNotifications />
        </TabsContent>
        <TabsContent value="scheduled">
          <ScheduledNotifications />
        </TabsContent>
        <TabsContent value="active">
          <ActiveNotifications />
        </TabsContent>
      </Tabs>

      <NotificationTypeDialog
        isAddScreenOpen={isAddScreenOpen}
        setIsAddScreenOpen={setIsAddScreenOpen}
        handleAddOption={handleAddOption}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:min-w-[800px] shadow-xl border-2 border-primary bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground font-industry font-bold">
              {selectedNotication ? 'Edit In-App Notification' : 'Add In-App Notification'}
            </DialogTitle>
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
              onNotificationSent={(status) => handleNotificationSent(status, 0)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationsTable;