'use client';

import { Notification } from '@/types';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { useSession } from 'next-auth/react';
import { customFetch } from '@/lib/customFetch';
import moment from 'moment';

interface NotificationsContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
  updateNotification: (
    id: string,
    updatedNotification: Partial<Notification>
  ) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  sendNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  getNotification: (id: string) => Promise<Notification>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider'
    );
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.teamId) {
      fetchNotifications();
    }
  }, [session]);

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const fetchNotifications = async () => {
    if (!session?.user?.teamId) {
      setError('No team ID available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await customFetch(
        `/panel/in-app-modal/${session.user.teamId}`,
        {
          cache: 'no-store' // Don't cache notifications list to ensure fresh data
        }
      );
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id'>) => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      const newNotification = await customFetch('/panel/in-app-modal', {
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify({ ...notification, teamId: session.user.teamId })
      });

      setNotifications((prev) => [...prev, newNotification]);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An error occurred while adding notification';
      console.error('Error in addNotification:', errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  const updateNotification = async (
    modalId: string,
    updatedNotification: Partial<Notification>
  ) => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      const updated = await customFetch(
        `/panel/in-app-modal/${session.user.teamId}/${modalId}`,
        {
          method: 'PUT',
          cache: 'no-store',
          body: JSON.stringify(updatedNotification)
        }
      );

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === modalId ? updated : notif))
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An error occurred while updating notification';
      console.error('Error in updateNotification:', errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  const getNotification = async (id: string): Promise<Notification> => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      return await customFetch(`/panel/in-app-modal/${id}`, {
        cache: 'force-cache', // Cache individual notification details
        revalidate: 60, // Revalidate every minute
        teamId: session.user.teamId
      });
    } catch (err) {
      console.error('Error fetching notification:', err);
      throw err;
    }
  };

  const deleteNotification = async (id: string) => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      await customFetch(`/panel/in-app-modal/${id}`, {
        method: 'DELETE',
        cache: 'no-store',
        teamId: session.user.teamId
      });

      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting notification';
      console.error('Error in deleteNotification:', errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  const sendNotification = async (notification: Omit<Notification, 'id'>) => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      const scheduledDateTime = moment
        .tz(
          `${notification.scheduled_date?.split('T')[0]}T${
            notification.scheduled_time
          }`,
          notification.timezone || 'UTC'
        )
        .toISOString();

      const response = await customFetch(
        `/panel/in-app-modal/${session.user.teamId}`,
        {
          method: 'POST',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.token}`
          },
          body: JSON.stringify({
            teamId: session.user.teamId,
            type: notification.type,
            title: notification.title,
            body: notification.body,
            image_url: notification.image_url,
            expiration_date: scheduledDateTime, // Changed key to expiration_date
            button_text: notification.button_text,
            button_text_color: notification.button_text_color,
            button_background_color: notification.button_background_color,
            text_color: notification.text_color,
            background_color: notification.background_color,
            status: 'Scheduled'
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to send in-app modal: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const result = await response.json();
      console.log('In-app modal scheduled successfully:', result);
      setNotifications((prev) => [...prev, result]);
      return result;
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An error occurred while sending notification';
      console.log('Error in sendNotification:', errorMsg);
      setError(errorMsg);
      throw err;
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        error,
        addNotification,
        updateNotification,
        deleteNotification,
        sendNotification,
        refreshNotifications,
        getNotification
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
