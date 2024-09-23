'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, Clock3Icon, InfoIcon } from 'lucide-react';
import DevicePreview from './DevicePreview';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageConfig } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface NotificationsComponentProps {
  config?: Partial<MessageConfig>;
  onSave: (config: MessageConfig) => void;
  teamId: string;
  onNotificationSent: (status: "Scheduled" | "Draft" | "Failed" | "Active" | "Completed" | "Canceled" | "Deleted") => void;
}
const defaultConfig: MessageConfig = {
  modalType: 'Modal',
  teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
  textColor: '#000000',
  title: 'Major League Rugby Back of the Year 2024',
  body: 'The New England Free Jacks’ 2024 season will be remembered for its exhilarating highs, and much of that success can be attributed to the electrifying performances of Reece MacDonald. ',
  imageUrl: 'https://freejacks.com/wp-content/uploads/2024/08/Reece-1.jpg',
  buttonText: 'Read More',
  buttonBackground: '#24613a',
  buttonTextColor: '#ffffff',
  scheduledDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
  scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toTimeString().slice(0, 5), // HH:MM format
  expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  status: 'Draft', // Add status field with default value 'Draft'
  id: '', // Add default value for id
  createdAt: new Date().toISOString(), // Add default value for createdAt
  createdBy: '', // Add default value for createdBy
  updatedAt: new Date().toISOString(), // Add default value for updatedAt
};

export default function NotificationConfig({ config, onSave, teamId, onNotificationSent }: NotificationsComponentProps) {
  const [localConfig, setLocalConfig] = useState<MessageConfig>({
    ...defaultConfig,
    ...config
  });
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [timeUntilSend, setTimeUntilSend] = useState<string>('');

  const calculateExpirationDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  useEffect(() => {
    const updateTimeUntilSend = () => {
      const now = new Date();
      const scheduledDateTime = new Date(`${localConfig.scheduledDate?.split('T')[0]}T${localConfig.scheduledTime}`);
      const diff = scheduledDateTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilSend('Scheduled time has passed');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilSend(`Sending in ${hours}h ${minutes}m`);
      }
    };

    updateTimeUntilSend();
    const interval = setInterval(updateTimeUntilSend, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [localConfig.scheduledDate, localConfig.scheduledTime]);

  const updateConfig = (key: keyof MessageConfig, value: string | Date | undefined) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: key === 'scheduledDate' || key === 'expirationDate'
        ? (value instanceof Date ? value.toISOString() : value)
        : value
    }));
  };

  const handleSave = () => {
    const updatedConfig: MessageConfig = {
      ...localConfig,
      status: 'Draft' as const,
      scheduledDate: undefined,
      scheduledTime: undefined,
    };
    onSave(updatedConfig);
    onNotificationSent('Draft');
    setNotificationStatus('Notification saved as draft');
  };

  const sendNotification = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_NOTIFICATION_KEY;
      if (!apiKey) {
        throw new Error('API key is missing');
      }
      const scheduledDateTime = moment.tz(
        `${localConfig.scheduledDate?.split('T')[0]}T${localConfig.scheduledTime}`,
        localConfig.timezone || 'UTC'
      ).toISOString();

      const response = await fetch(`https://api.seawolves.envorso.com/v1/panel/in-app-modal?teamId=${teamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          teamId: localConfig.teamId,
          modalType: localConfig.modalType,
          expirationDate: localConfig.expirationDate,
          title: localConfig.title,
          image_url: localConfig.imageUrl,
          body: localConfig.body,
          button_text: localConfig.buttonText,
          text_color: localConfig.textColor,
          background_color: localConfig.buttonBackground,
          button_text_color: localConfig.buttonTextColor,
          button_background_color: localConfig.buttonBackground,
          scheduledDateTime: scheduledDateTime,
          timezone: localConfig.timezone,
          status: 'Scheduled', // Always set status to 'Scheduled'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send in-app modal: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const result = await response.json();
      console.log("In-app modal scheduled successfully:", result);
      setNotificationStatus('In-app modal scheduled successfully!');
      onNotificationSent('Scheduled');
    } catch (error) {
      console.error('Error scheduling in-app modal:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setNotificationStatus(`Failed to schedule in-app modal: ${errorMessage}`);
      onNotificationSent('Failed');
    }
  };




  return (
    <div className="bg-background text-foreground w-full p-4 rounded-lg border border-primary shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label className="text-foreground">Layout</Label>
            <RadioGroup
              value={localConfig.modalType}
              onValueChange={(value) => updateConfig('modalType', value as 'Modal' | 'Image' | 'Toast')}
              className="flex space-x-4"
            >
              {['Modal', 'Image', 'Toast'].map((type) => (
                <div key={type} className="flex items-center">
                  <RadioGroupItem value={type} id={type.toLowerCase()} className="border-primary text-primary" />
                  <Label htmlFor={type.toLowerCase()} className="ml-2 text-foreground">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="title" className="text-foreground">Title (max 50 characters)</Label>
            <Input
              id="title"
              value={localConfig.title}
              onChange={(e) => updateConfig('title', e.target.value.slice(0, 50))}
              maxLength={50}
              className="border-primary focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground">{localConfig.title.length}/50 characters</p>
          </div>

          {localConfig.modalType === 'Modal' && (
            <div>
              <Label htmlFor="body" className="text-foreground">Body (max 200 characters)</Label>
              <Textarea
                id="body"
                value={localConfig.body}
                onChange={(e) => updateConfig('body', e.target.value.slice(0, 200))}
                className="border-primary focus:ring-primary"
              />
              <p className="text-sm text-muted-foreground">{localConfig.body.length}/200 characters</p>
            </div>
          )}

          {(localConfig.modalType === 'Image' || localConfig.modalType === 'Modal') && (
            <div>
              <Label htmlFor="imageUrl" className="text-foreground">Image URL</Label>
              <Input
                id="imageUrl"
                value={localConfig.imageUrl}
                onChange={(e) => updateConfig('imageUrl', e.target.value)}
                className="border-primary focus:ring-primary"
              />
            </div>
          )}

          {(localConfig.modalType === 'Modal') && (
            <div>
              <Label htmlFor="buttonText" className="text-foreground">Button Text</Label>
              <Input
                id="buttonText"
                value={localConfig.buttonText}
                onChange={(e) => updateConfig('buttonText', e.target.value)}
                className="border-primary focus:ring-primary"
              />
            </div>
          )}

          <div>
            <Label htmlFor="timezone" className="text-foreground">Timezone</Label>
            <Select
              value={localConfig.timezone}
              onValueChange={(value) => updateConfig('timezone', value)}
            >
              <SelectTrigger className="w-full border-primary focus:ring-primary">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className='bg-background'>
                {moment.tz.names().map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-foreground">Scheduled Date and Time</Label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <DatePicker
                  selected={localConfig.scheduledDate ? new Date(localConfig.scheduledDate) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      updateConfig('scheduledDate', date);
                    } else {
                      updateConfig('scheduledDate', undefined);
                    }
                  }}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 pl-10 border border-primary rounded focus:ring-primary text-foreground"
                  customInput={<Input />}
                />
                <CalendarIcon className="absolute left-3 size-4 top-1/2 transform -translate-y-1/2 text-primary" />
              </div>
              <div className="relative flex-grow">
                <Input
                  type="time"
                  value={localConfig.scheduledTime}
                  onChange={(e) => updateConfig('scheduledTime', e.target.value)}
                  className="w-full p-2 pl-10 border border-primary rounded focus:ring-primary text-foreground"
                />
                <Clock3Icon className="absolute size-4 left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              </div>
            </div>
            <p className="text-sm text-primary mt-1">{timeUntilSend}</p>
          </div>

          <div>
            <Label className="text-foreground flex items-center">
              Expiration Date
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="ml-2 h-4 w-4 text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="z-50 bg-background p-2 rounded shadow">
                    <p>The date when this notification will no longer be shown to users.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select
              value={localConfig.expirationDate ? new Date(localConfig.expirationDate).getDate() - new Date().getDate() + '' : ''}
              onValueChange={(value) => updateConfig('expirationDate', calculateExpirationDate(parseInt(value)))}
            >
              <SelectTrigger className="w-full border-primary focus:ring-primary">
                <SelectValue placeholder="Select expiration" />
              </SelectTrigger>
              <SelectContent className='bg-background'>
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} {days === 1 ? 'day' : 'days'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-primary mt-1">
              Expiration: {localConfig.expirationDate
                ? new Date(localConfig.expirationDate).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                : 'Not set'}
            </p>
          </div>
        </div>
        <DevicePreview config={localConfig} />
      </div>
      <div className="mt-6 space-x-4">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Save
        </Button>
        <Button onClick={sendNotification} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          Send Notification
        </Button>
      </div>
      {notificationStatus && <p className="mt-4 text-sm text-primary">{notificationStatus}</p>}
    </div>
  );
}