'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string;
  team_id: string;
  modal_type: string;
  expiration_date: string;
  created_at: string;
  updated_at: string;
  title?: string;
  image_url?: string;
  body?: string;
  text_color?: string;
  background_color?: string;
  button_text?: string;
  button_text_color?: string;
  button_background_color?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  loading: boolean;
  error: string | null;
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const teamId = process.env.NEXT_PUBLIC_TEAM_ID as string;
        const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal/${teamId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications, loading, error }}>
      {children}
    </NotificationsContext.Provider>
  );
};