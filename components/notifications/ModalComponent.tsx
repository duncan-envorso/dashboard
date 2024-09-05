'use client';

import React, { useState } from 'react';
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
  modalType: 'modal',
  teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
  textColor: '#000000',
  title: '',
  body: '',
  imageUrl: '',
  buttonText: '',
  buttonBackground: '#000000',
  buttonTextColor: '#ffffff',
  expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  scheduledDate: new Date().toISOString(),
  scheduledTime: '12:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export default function NotificationConfig({ config, onSave, teamId, onNotificationSent }: NotificationsComponentProps) {
  const [localConfig, setLocalConfig] = useState<MessageConfig>({
    ...defaultConfig,
    ...config
  });
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

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
    <div className="bg-background w-full p-6 rounded-lg border border-border shadow-md">
      <h2 className="text-2xl font-bold mb-6">In-App Notification Configuration</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Layout</Label>
            <RadioGroup
              value={localConfig.modalType}
              onValueChange={(value) => updateConfig('modalType', value as 'modal' | 'image' | 'toast')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="modal" id="modal" />
                <Label htmlFor="modal">Modal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image">Image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="toast" id="toast" />
                <Label htmlFor="toast">Toast</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={localConfig.title}
              onChange={(e) => updateConfig('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              value={localConfig.body}
              onChange={(e) => updateConfig('body', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={localConfig.imageUrl}
              onChange={(e) => updateConfig('imageUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Button Text</Label>
            <Input
              id="title"
              value={localConfig.buttonText}
              onChange={(e) => updateConfig('buttonText', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Scheduled Date and Time</Label>
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
                  className="w-full p-2 pl-10 border rounded"
                  customInput={<Input />}
                />
                <CalendarIcon className="absolute left-3 size-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="relative flex-grow">
                <Input
                  type="time"
                  value={localConfig.scheduledTime}
                  onChange={(e) => updateConfig('scheduledTime', e.target.value)}
                  className="w-full p-2 pl-10 border rounded"
                />
                <Clock3Icon className="absolute size-4 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={localConfig.timezone}
              onValueChange={(value) => updateConfig('timezone', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {moment.tz.names().map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Expiration Date</Label>
            <div className="relative">
              <DatePicker
                selected={localConfig.expirationDate ? new Date(localConfig.expirationDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    updateConfig('expirationDate', date.toISOString());
                  } else {
                    updateConfig('expirationDate', undefined);
                  }
                }}
                dateFormat="MMMM d, yyyy"
                className="w-full p-2 pl-10 border rounded"
                customInput={<Input />}
              />
              <CalendarIcon className="absolute size-4 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
        <DevicePreview config={localConfig} />
      </div>
      <div className="mt-6 space-x-4">
        <Button onClick={handleSave}>
          Save
        </Button>
        <Button onClick={sendNotification}>
          Send Notification
        </Button>
      </div>
      {notificationStatus && <p className="mt-4 text-sm">{notificationStatus}</p>}
    </div>
  );
}