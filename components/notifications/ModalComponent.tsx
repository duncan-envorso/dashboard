'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon, Clock3Icon } from 'lucide-react';
import DevicePreview from './DevicePreview';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageConfig } from '@/types';
import ExpirationDateSelect from './ExpirationDateSelect';
import { useSession } from 'next-auth/react';
import { DatePicker } from './DatePicker';

interface NotificationsComponentProps {
  config?: Partial<MessageConfig>;
  onSave: (config: MessageConfig) => void;
  onNotificationSent: (
    status:
      | 'Scheduled'
      | 'Draft'
      | 'Failed'
      | 'Active'
      | 'Completed'
      | 'Canceled'
      | 'Deleted'
  ) => void;
}

const defaultConfig: MessageConfig = {
  modalType: 'Modal',
  teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
  textColor: '#000000',
  title: 'Major League Rugby Back of the Year 2024',
  body: `The New England Free Jacks' 2024 season will be remembered for its exhilarating highs, and much of that success can be attributed to the electrifying performances of Reece MacDonald. `,
  imageUrl: 'https://freejacks.com/wp-content/uploads/2024/08/Reece-1.jpg',
  buttonText: 'Read More',
  buttonBackground: '#24613a',
  buttonTextColor: '#ffffff',
  scheduledDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  scheduledTime: new Date(Date.now() + 60 * 60 * 1000)
    .toTimeString()
    .slice(0, 5),
  expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  status: 'Draft',
  id: '',
  createdAt: new Date().toISOString(),
  createdBy: '',
  updatedAt: new Date().toISOString()
};

export default function NotificationConfig({
  config,
  onSave,
  onNotificationSent
}: NotificationsComponentProps) {
  const { data: session, status } = useSession();

  const [notificationStatus, setNotificationStatus] = useState<string | null>(
    null
  );
  const [timeUntilSend, setTimeUntilSend] = useState<string>('');

  const [localConfig, setLocalConfig] = useState<MessageConfig>(() => ({
    ...defaultConfig,
    ...config,
    teamId: session?.user?.teamId || defaultConfig.teamId
  }));

  useEffect(() => {
    if (session?.user?.teamId) {
      setLocalConfig((prev) => ({ ...prev, teamId: session.user.teamId }));
    }
  }, [session]);

  useEffect(() => {
    const updateTimeUntilSend = () => {
      const now = new Date();
      const scheduledDateTime = new Date(
        `${localConfig.scheduledDate?.split('T')[0]}T${
          localConfig.scheduledTime
        }`
      );
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
    const interval = setInterval(updateTimeUntilSend, 60000);

    return () => clearInterval(interval);
  }, [localConfig.scheduledDate, localConfig.scheduledTime]);

  const updateConfig = (
    key: keyof MessageConfig,
    value: string | Date | undefined
  ) => {
    setLocalConfig((prev) => {
      const updatedConfig = { ...prev };
      if (key === 'teamId') {
        updatedConfig[key] = (value as string) || prev.teamId;
      } else if (key === 'scheduledDate' || key === 'expirationDate') {
        updatedConfig[key] =
          value instanceof Date ? value.toISOString() : value;
      } else if (key === 'createdAt' || key === 'updatedAt') {
        updatedConfig[key] =
          value instanceof Date
            ? value
            : value
            ? new Date(value).toISOString()
            : prev[key];
      } else {
        (updatedConfig as any)[key] = value !== undefined ? value : prev[key];
      }
      return updatedConfig;
    });
  };

  const handleSave = () => {
    const updatedConfig: MessageConfig = {
      ...localConfig,
      status: 'Draft',
      scheduledDate: undefined,
      scheduledTime: undefined
    };
    onSave(updatedConfig);
    onNotificationSent('Draft');
    setNotificationStatus('Notification saved as draft');
  };
  const API_URL = process.env.NEXT_API_URL;
  const NOTIFICATIONS_ENDPOINT = `${API_URL}/panel/in-app-modal`;

  const sendNotification = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_NOTIFICATION_KEY;
      if (!apiKey) {
        throw new Error('API key is missing');
      }
      if (!localConfig.teamId) {
        throw new Error('Team ID is missing');
      }

      const scheduledDateTime = moment
        .tz(
          `${localConfig.scheduledDate?.split('T')[0]}T${
            localConfig.scheduledTime
          }`,
          localConfig.timezone || 'UTC'
        )
        .toISOString();

      const response = await fetch(
        `${NOTIFICATIONS_ENDPOINT}?teamId=${localConfig.teamId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.token}`
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
            scheduledAt: scheduledDateTime,
            timezone: localConfig.timezone,
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
      setNotificationStatus('In-app modal scheduled successfully!');
      onNotificationSent('Scheduled');
    } catch (error) {
      console.log('Error scheduling in-app modal:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setNotificationStatus(`Failed to schedule in-app modal: ${errorMessage}`);
      onNotificationSent('Failed');
    }
  };

  return (
    <div className="w-full rounded-lg border border-primary bg-background p-4 text-foreground shadow-sm">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label className="text-foreground">Layout</Label>
            <RadioGroup
              value={localConfig.modalType}
              onValueChange={(value) =>
                updateConfig('modalType', value as 'Modal' | 'Image' | 'Toast')
              }
              className="flex space-x-4"
            >
              {['Modal', 'Image', 'Toast'].map((type) => (
                <div key={type} className="flex items-center">
                  <RadioGroupItem
                    value={type}
                    id={type.toLowerCase()}
                    className="border-primary text-primary"
                  />
                  <Label
                    htmlFor={type.toLowerCase()}
                    className="ml-2 text-foreground"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="title" className="text-foreground">
              Title (max 50 characters)
            </Label>
            <Input
              id="title"
              value={localConfig.title}
              onChange={(e) =>
                updateConfig('title', e.target.value.slice(0, 50))
              }
              maxLength={50}
              className="border-primary focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground">
              {localConfig.title.length}/50 characters
            </p>
          </div>

          {localConfig.modalType === 'Modal' && (
            <div>
              <Label htmlFor="body" className="text-foreground">
                Body (max 200 characters)
              </Label>
              <Textarea
                id="body"
                value={localConfig.body}
                onChange={(e) =>
                  updateConfig('body', e.target.value.slice(0, 200))
                }
                className="border-primary focus:ring-primary"
              />
              <p className="text-sm text-muted-foreground">
                {localConfig.body.length}/200 characters
              </p>
            </div>
          )}

          {(localConfig.modalType === 'Image' ||
            localConfig.modalType === 'Modal') && (
            <div>
              <Label htmlFor="imageUrl" className="text-foreground">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={localConfig.imageUrl}
                onChange={(e) => updateConfig('imageUrl', e.target.value)}
                className="border-primary focus:ring-primary"
              />
            </div>
          )}

          {localConfig.modalType === 'Modal' && (
            <div>
              <Label htmlFor="buttonText" className="text-foreground">
                Button Text
              </Label>
              <Input
                id="buttonText"
                value={localConfig.buttonText}
                onChange={(e) => updateConfig('buttonText', e.target.value)}
                className="border-primary focus:ring-primary"
              />
            </div>
          )}

          <div>
            <Label htmlFor="timezone" className="text-foreground">
              Timezone
            </Label>
            <Select
              value={localConfig.timezone}
              onValueChange={(value) => updateConfig('timezone', value)}
            >
              <SelectTrigger className="w-full border-primary focus:ring-primary">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-background">
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
                  selected={
                    localConfig.scheduledDate
                      ? new Date(localConfig.scheduledDate)
                      : null
                  }
                  onChange={(date: Date | null) =>
                    updateConfig('scheduledDate', date?.toISOString())
                  }
                  dateFormat="MMMM d, yyyy"
                  className="w-full rounded border border-primary p-2 pl-10 text-foreground focus:ring-primary"
                  customInput={<Input />}
                />
                <CalendarIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-primary" />
              </div>
              <div className="relative flex-grow">
                <Input
                  type="time"
                  value={localConfig.scheduledTime}
                  onChange={(e) =>
                    updateConfig('scheduledTime', e.target.value)
                  }
                  className="w-full rounded border border-primary p-2 pl-10 text-foreground focus:ring-primary"
                />
                <Clock3Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-primary" />
              </div>
            </div>
            <p className="mt-1 text-sm text-primary">{timeUntilSend}</p>
          </div>

          <ExpirationDateSelect
            localConfig={localConfig}
            updateConfig={updateConfig}
          />
        </div>
        <DevicePreview config={localConfig} />
      </div>
      <div className="mt-6 space-x-4">
        <Button
          onClick={handleSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save
        </Button>
        <Button
          onClick={sendNotification}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Schedule Notification
        </Button>
      </div>
      {notificationStatus && (
        <p className="mt-4 text-sm text-primary">{notificationStatus}</p>
      )}
    </div>
  );
}
