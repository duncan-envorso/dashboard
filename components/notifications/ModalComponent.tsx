'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, Clock3Icon } from 'lucide-react';
import DevicePreview from './DevicePreview';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageConfig } from '@/types';

interface NotificationsComponentProps {
  config?: Partial<MessageConfig>;
  onSave: (config: MessageConfig) => void;
  teamId: string;
  onNotificationSent: (status: "scheduled" | "draft" | "failed" | "active" | "completed" | "canceled") => void;
}

const defaultConfig: MessageConfig = {
  modalType: 'Modal',
  teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
  textColor: '#000000',
  title: '',
  body: '',
  imageUrl: '',
  buttonText: '',
  buttonBackground: '#000000',
  buttonTextColor: '#ffffff',
  expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  scheduledDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
  scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toTimeString().slice(0, 5), // HH:MM format
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export default function NotificationConfig({ config, onSave, teamId, onNotificationSent }: NotificationsComponentProps) {
  const [localConfig, setLocalConfig] = useState<MessageConfig>({
    ...defaultConfig,
    ...config
  });
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [timeUntilSend, setTimeUntilSend] = useState<string>('');

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
      [key]: key === 'scheduledDate' && value instanceof Date ? value.toISOString() : value
    }));
  };

  const handleSave = () => {
    onSave(localConfig);
  };

  const sendNotification = async () => {
    console.log(localConfig)
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
          teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
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
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send in-app modal: ${response.status} ${response.statusText}. ${errorText}`);
      }



      const result = await response.json();
      console.log("In-app modal sent successfully:", result);
      setNotificationStatus('In-app modal sent successfully!');
      onNotificationSent('active');
    } catch (error) {
      console.error('Error sending in-app modal:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setNotificationStatus(`Failed to send in-app modal: ${errorMessage}`);
      onNotificationSent('failed');
    }
  };

  return (
    <div className="bg-white dark:bg-navy text-navy dark:text-white w-full p-4 rounded-lg border border-green shadow-sm">
      {/* <h2 className="text-2xl font-bold mb-6 text-navy dark:text-white">In-App Notification Configuration</h2> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="">
            <Label className="text-navy dark:text-white">Layout</Label>
            <RadioGroup
              value={localConfig.modalType}
              onValueChange={(value) => updateConfig('modalType', value as 'Modal' | 'Image' | 'Toast')}
              className="flex space-x-4"
            >
              {['Modal', 'Image', 'Toast'].map((type) => (
                <div key={type} className="flex items-center">
                  <RadioGroupItem value={type} id={type.toLowerCase()} className="border-green text-green" />
                  <Label htmlFor={type.toLowerCase()} className="ml-2 text-navy dark:text-white">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>


          <div className="">
            <Label htmlFor="title" className="text-navy dark:text-white">Title (max 50 characters)</Label>
            <Input
              id="title"
              value={localConfig.title}
              onChange={(e) => updateConfig('title', e.target.value.slice(0, 50))}
              maxLength={50}
              className="border-green focus:ring-green"
            />
            <p className="text-sm text-gray-500">{localConfig.title.length}/50 characters</p>
          </div>


          {localConfig.modalType === 'Modal' && (

            <div className="">
              <Label htmlFor="body" className="text-navy dark:text-white">Body</Label>
              <Textarea
                id="body"
                value={localConfig.body}
                onChange={(e) => updateConfig('body', e.target.value)}
                className="border-green focus:ring-green"
              />
            </div>
          )}

          {(localConfig.modalType === 'Image' || localConfig.modalType === 'Modal') && (
            <div className="">
              <Label htmlFor="imageUrl" className="text-navy dark:text-white">Image URL</Label>
              <Input
                id="imageUrl"
                value={localConfig.imageUrl}
                onChange={(e) => updateConfig('imageUrl', e.target.value)}
                className="border-green focus:ring-green"
              />
            </div>
          )}

          {(localConfig.modalType === 'Modal') && (
            <div className="">
              <Label htmlFor="buttonText" className="text-navy dark:text-white">Button Text</Label>
              <Input
                id="buttonText"
                value={localConfig.buttonText}
                onChange={(e) => updateConfig('buttonText', e.target.value)}
                className="border-green focus:ring-green"
              />
            </div>
          )}

          <div className="">
            <Label className="text-navy dark:text-white">Scheduled Date and Time</Label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <DatePicker
                  selected={localConfig.scheduledDate ? new Date(localConfig.scheduledDate) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      updateConfig('scheduledDate', date.toISOString());
                    } else {
                      updateConfig('scheduledDate', undefined);
                    }
                  }}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 pl-10 border border-green rounded focus:ring-green text-navy dark:text-white dark:bg-navy"
                  customInput={<Input />}
                />
                <CalendarIcon className="absolute left-3 size-4 top-1/2 transform -translate-y-1/2 text-green" />
              </div>
              <div className="relative flex-grow">
                <Input
                  type="time"
                  value={localConfig.scheduledTime}
                  onChange={(e) => updateConfig('scheduledTime', e.target.value)}
                  className="w-full p-2 pl-10 border border-green rounded focus:ring-green text-navy dark:text-white dark:bg-navy"
                />
                <Clock3Icon className="absolute size-4 left-3 top-1/2 transform -translate-y-1/2 text-green" />
              </div>
            </div>
          </div>

          <div className="">
            <Label htmlFor="timezone" className="text-navy dark:text-white">Timezone</Label>
            <Select
              value={localConfig.timezone}
              onValueChange={(value) => updateConfig('timezone', value)}
            >
              <SelectTrigger className="w-full border-green focus:ring-green">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {moment.tz.names().map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <Label className="text-navy dark:text-white">Scheduled Date and Time</Label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <DatePicker
                  selected={localConfig.scheduledDate ? new Date(localConfig.scheduledDate) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      updateConfig('scheduledDate', date.toISOString());
                    } else {
                      updateConfig('scheduledDate', undefined);
                    }
                  }}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 pl-10 border border-green rounded focus:ring-green text-navy dark:text-white dark:bg-navy"
                  customInput={<Input />}
                />
                <CalendarIcon className="absolute left-3 size-4 top-1/2 transform -translate-y-1/2 text-green" />
              </div>
              <div className="relative flex-grow">
                <Input
                  type="time"
                  value={localConfig.scheduledTime}
                  onChange={(e) => updateConfig('scheduledTime', e.target.value)}
                  className="w-full p-2 pl-10 border border-green rounded focus:ring-green text-navy dark:text-white dark:bg-navy"
                />
                <Clock3Icon className="absolute size-4 left-3 top-1/2 transform -translate-y-1/2 text-green" />
              </div>
            </div>
            <p className="text-sm text-red-500">{timeUntilSend}</p>
          </div>
        </div>
        <DevicePreview config={localConfig} />
      </div>
      <div className="mt-6 space-x-4">
        <Button onClick={handleSave} className="bg-green hover:bg-green-dark text-white">
          Save
        </Button>
        <Button onClick={sendNotification} className="bg-navy hover:bg-navy-light text-white">
          Send Notification
        </Button>
      </div>
      {notificationStatus && <p className="mt-4 text-sm text-green">{notificationStatus}</p>}
    </div>
  );
}