'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NotifcationsHeader from './NotificationsHeader';
import { toast } from '../ui/use-toast';
import ModalComponent from './ModalComponent';
import NotificationComponent from './NotificationComponent';
import { MessageConfig } from '@/types';
import { Button } from "@/components/ui/button";
import NotificationsCard from './NewNotifcationsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SentNotificationsTable from './ServerNotifcationsCard';

interface NotifcationWithStatus extends MessageConfig {
  createdAt: string | number | Date;
  createdBy: string;
  status: "scheduled" | "draft" | "failed" | "active" | "completed" | "canceled" | "completed";
}

const NotificationsTable: React.FC = () => {
  const [notifications, setNotifications] = useState<NotifcationWithStatus[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNotication, setSelectedNotication] = useState<NotifcationWithStatus | null>(null);
  const [isAddScreenOpen, setIsAddScreenOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<'push' | 'Modal' | null>(null);

  const handleNotificationSent = (status: "scheduled" | "draft" | "failed" | "active" | "canceled" | "completed", notificationIndex: number) => {
    setNotifications(prev => prev.map((notif, index) =>
      index === notificationIndex ? { ...notif, status } : notif
    ));
  };

  const handleEdit = (notification: NotifcationWithStatus) => {
    setSelectedNotication(notification);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setIsAddScreenOpen(true);
  };

  const handleAddOption = (option: 'push' | 'Modal') => {
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
    } catch (error) {
      console.error('Error sending in-app modal:', error);
      handleNotificationSent('failed', index);
    }
  };

  return (
    <div className="bg-light-grey dark:bg-navy min-h-screen">
      <NotifcationsHeader handleAdd={handleAdd} />
      <Tabs defaultValue="drafts">
        <TabsList className="bg-white dark:bg-navy-light">
          <TabsTrigger 
            value="drafts"
            className="data-[state=active]:bg-green data-[state=active]:text-white"
          >
            Scheduled
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="data-[state=active]:bg-green data-[state=active]:text-white"
          >
            Completed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="drafts">
          <NotificationsCard
            notifications={notifications}
            handleEdit={handleEdit}
            handleSend={handleSend}
          />
        </TabsContent>
        <TabsContent value="completed">
          <SentNotificationsTable />
        </TabsContent>
      </Tabs>


      <Dialog open={isAddScreenOpen} onOpenChange={setIsAddScreenOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-navy-light border-2 border-green">
          <DialogHeader>
            <DialogTitle className="text-navy dark:text-white font-industry font-bold">Choose Notification Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={() => handleAddOption('push')} className="bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy dark:hover:bg-gray-200">
              Push Notification
            </Button>
            <Button onClick={() => handleAddOption('Modal')} className="bg-green text-white hover:bg-green-dark">
              Modal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:min-w-[800px] shadow-xl border-2  border-green bg-white dark:bg-navy-light">
          <DialogHeader>
            <DialogTitle className="text-navy dark:text-white font-industry font-bold">
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
              onNotificationSent={(status: "scheduled" | "draft" | "failed" | "active" | "completed" | "canceled") =>
                handleNotificationSent(status, notifications.indexOf(selectedNotication!))
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationsTable;