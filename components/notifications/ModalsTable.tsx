'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from '../ui/use-toast';
import ModalComponent from './ModalComponent';
import NotificationComponent from './NotificationComponent';
import { MessageConfig } from '@/types';
import { Button } from '@/components/ui/button';
import NotificationsCard from './AllNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SentNotificationsTable from './CompletedNotifications';
import DraftNotifications from './DraftNotifications';
import ScheduledNotifications from './ScheduledNotifications';
import ActiveNotifications from './ActiveNotifications';
import { Plus } from 'lucide-react';
import NotificationTypeDialog from './NotifcationTypeDialog';
import { useState } from 'react';
import NotificationConfig from './ModalComponent';
import { useSession } from 'next-auth/react';
import NotificationsTable from './NotifcationsTable';

const ModalsTable: React.FC = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<MessageConfig[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNotication, setSelectedNotication] =
    useState<MessageConfig | null>(null);
  const [isAddScreenOpen, setIsAddScreenOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<'push' | 'Modal' | null>(
    null
  );

  const handleNotificationSent = (
    status:
      | 'Scheduled'
      | 'Draft'
      | 'Failed'
      | 'Active'
      | 'Canceled'
      | 'Completed'
      | 'Deleted',
    notificationIndex: number
  ) => {
    setNotifications((prev) =>
      prev.map((notif, index) =>
        index === notificationIndex
          ? { ...notif, status: status as MessageConfig['status'] }
          : notif
      )
    );
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
        expirationDate:
          updatedNotification.expirationDate || new Date().toISOString(),
        scheduledDate: null,
        scheduledTime: null
      };

      if (selectedNotication) {
        // Edit existing notification
        const response = await fetch(
          `https://api.seawolves.envorso.com/v1/panel/in-app-modal/${selectedNotication.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user.token}` // Add the Bearer
            },
            body: JSON.stringify(notificationToSave)
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update notification');
        }

        const updatedNotif = await response.json();

        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === selectedNotication.id ? updatedNotif : notif
          )
        );

        toast({
          title: 'Notification updated successfully',
          description:
            'Your notification has been updated and set to draft status'
        });
      } else {
        // Add new notification
        const response = await fetch(
          'https://api.seawolves.envorso.com/v1/panel/in-app-modal?teamId=034db172-942f-48b8-bc91-a0b3eb3a025f',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user.token}` // Add the Bearer token here
            },
            body: JSON.stringify(notificationToSave)
          }
        );

        if (!response.ok) {
          throw new Error('Failed to add notification');
        }

        const newNotif = await response.json();

        console.log('newNotif', newNotif);

        setNotifications((prev) => [...prev, newNotif]);

        toast({
          title: 'Notification added successfully',
          description: 'Your new notification has been added as a draft'
        });
      }

      setIsDialogOpen(false);
      setSelectedOption(null);
    } catch (error) {
      console.error('Error saving notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOption(null);
  };

  return (
    <div className="">
      <div className="">
        <div className="mb-6 flex items-center justify-between"></div>
        <Tabs defaultValue="all" className="w-full ">
          <TabsList className=" mb-4 flex items-center justify-between bg-slate-50 p-6">
            <div className="flex  ">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> New Notification
            </Button>
          </TabsList>

          <div className="">
            <TabsContent className="" value="all">
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
          </div>
        </Tabs>
      </div>

      <NotificationTypeDialog
        isAddScreenOpen={isAddScreenOpen}
        setIsAddScreenOpen={setIsAddScreenOpen}
        handleAddOption={handleAddOption}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-primary bg-card sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-foreground">
              {selectedNotication
                ? 'Edit In-App Notification'
                : 'Add In-App Notification'}
            </DialogTitle>
          </DialogHeader>
          {selectedOption === 'push' ? (
            <NotificationComponent />
          ) : (
            <NotificationConfig
              config={selectedNotication as MessageConfig}
              onSave={(updatedConfig: MessageConfig) => {
                handleSave(updatedConfig);
                handleCloseDialog();
              }}
              onNotificationSent={(status) => handleNotificationSent(status, 0)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalsTable;
