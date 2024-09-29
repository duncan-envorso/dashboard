  'use client'

  import {  Notification } from '@/types';
  import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

  

  interface NotificationsContextType {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
    updateNotification: (id: string, updatedNotification: Partial<Notification>) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    sendNotification: (id: string) => Promise<void>;
    refreshNotifications: () => Promise<void>; // Add this line
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

    const teamId = process.env.NEXT_PUBLIC_TEAM_ID as string;
    const apiKey = process.env.NEXT_PUBLIC_NOTIFICATION_KEY as string;
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${teamId}`, {
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
      fetchNotifications();
    }, []);

    const refreshNotifications = async () => {
      await fetchNotifications();
    };

    //todo: refetch notifications when the teamId or apiKey changes

    const addNotification = async (notification: Omit<Notification, 'id'>) => {
      try {
        const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ ...notification, teamId }),
        });
        if (!response.ok) {
          throw new Error('Failed to add notification');
        }
        const newNotification: Notification = await response.json();
        setNotifications(prev => [...prev, newNotification]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while adding notification');
      }
    };

    const updateNotification = async (id: string, updatedNotification: Partial<Notification>) => {
      console.log("updatedNotification", updatedNotification);
      try {
        const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${id}?teamId=${teamId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ ...updatedNotification, teamId }),
        });

        if (response.status === 404) {
          // Notification doesn't exist, create a new one
          return addNotification(updatedNotification as Omit<Notification, 'id'>);
        }

        if (!response.ok) {
          throw new Error('Failed to update notification');
        }

        const updated: Notification = await response.json();
        setNotifications(prev => prev.map(notif => notif.id === id ? updated : notif));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while updating notification');
      }
    };

    const deleteNotification = async (id: string) => {
      try {
        const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete notification');
        }
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while deleting notification');
      }
    };

    const sendNotification = async (id: string) => {
      try {
        const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${id}/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to send notification');
        }
        const updatedNotification: Notification = await response.json();
        setNotifications(prev => prev.map(notif => notif.id === id ? updatedNotification : notif));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while sending notification');
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
        refreshNotifications
      }}>
        {children}
      </NotificationsContext.Provider>
    );
  };