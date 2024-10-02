'use client'

import { Notification } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface NotificationsContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
  updateNotification: (id: string, updatedNotification: Partial<Notification>) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  sendNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  getNotification: (id: string) => Promise<Notification>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const apiKey = process.env.NEXT_PUBLIC_NOTIFICATION_KEY as string;

  const fetchNotifications = async () => {
    if (!session?.user?.teamId) {
      setError('No team ID available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${session.user.teamId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data: Notification[] = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.teamId) {
      fetchNotifications();
    }
  }, [session]);

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const addNotification = async (notification: Omit<Notification, 'id'>) => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ ...notification, teamId: session.user.teamId }),
      });
      console.log('Add notification response:', response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add notification: ${errorData.message || response.statusText}`);
      }
      const newNotification: Notification = await response.json();
      setNotifications(prev => [...prev, newNotification]);
    } catch (err) {
      console.error('Error in addNotification:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding notification');
      throw err;
    }
  };

  const updateNotification = async (modalId: string, updatedNotification: Partial<Notification>) => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    console.log("Updating notification with Modal ID:", modalId);
    console.log("Update payload:", updatedNotification);
    console.log("teamId:", session.user.teamId);
    console.log("apiKey:", apiKey.substring(0, 5) + "...");
    try {
      const url = `https://api.seawolves.envorso.com/v1/panel/in-app-modal/${session.user.teamId}/${modalId}`;
      console.log("API URL:", url);
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(updatedNotification),
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(`Failed to update notification: ${errorData.message || response.statusText}`);
      }
  
      const updated: Notification = await response.json();
      console.log("Updated notification:", updated);
  
      setNotifications(prev => prev.map(notif => notif.id === modalId ? updated : notif));
      
      await refreshNotifications();
    } catch (err) {
      console.error("Error in updateNotification:", err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating notification');
      throw err;
    }
  };

  const getNotification = async (id: string): Promise<Notification> => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${id}?teamId=${session.user.teamId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch notification: ${errorData.message || response.statusText}`);
      }

      const data: Notification = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching notification:", err);
      throw err;
    }
  };

  const deleteNotification = async (id: string) => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${id}?teamId=${session.user.teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete notification: ${errorData.message || response.statusText}`);
      }
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (err) {
      console.error("Error in deleteNotification:", err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting notification');
      throw err;
    }
  };

  const sendNotification = async (id: string) => {
    if (!session?.user?.teamId) {
      throw new Error('No team ID available');
    }

    try {
      const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${id}/send?teamId=${session.user.teamId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send notification: ${errorData.message || response.statusText}`);
      }
      const updatedNotification: Notification = await response.json();
      setNotifications(prev => prev.map(notif => notif.id === id ? updatedNotification : notif));
    } catch (err) {
      console.error("Error in sendNotification:", err);
      setError(err instanceof Error ? err.message : 'An error occurred while sending notification');
      throw err;
    }
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      loading,
      error,
      addNotification,
      updateNotification,
      deleteNotification,
      sendNotification,
      refreshNotifications,
      getNotification
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};