'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface NotificationConfig {
  title: string;
  body: string;
  topic: string;
  teamId: string;
}

export default function NotificationComponent() {
  const { data: session, status } = useSession();

  const [config, setConfig] = useState<NotificationConfig>({
    title: '',
    body: '',
    topic: 'miscellaneous',
    teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_NOTIFICATION_KEY;
      console.log('API Key:', process.env.NEXT_PUBLIC_NOTIFICATION_KEY);

      if (!apiKey) {
        throw new Error('API key is not set');
      }

      const response = await fetch(
        `${process.env.NEXT_API_URL}/panel/notifications?teamId=034db172-942f-48b8-bc91-a0b3eb3a025f`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.token}` // Add the Bearer
          },
          body: JSON.stringify({
            title: config.title,
            body: config.body,
            topic: config.topic,
            key: 'ENVORSO_HAS_THE_HIGHEST_SECURITY_KEY_EVER_$123&&'
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to send notification: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const result = await response.json();
      console.log('Notification sent:', result);
      toast({
        title: 'Success',
        description: 'Notification sent successfully'
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Error',
        description: `Failed to send notification. Please try again. ${
          error instanceof Error ? error.message : String(error)
        }`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-navy grid grid-cols-1 gap-6 rounded-lg border bg-white p-6 shadow-sm md:grid-cols-2">
      <div>
        <h3 className="text-navy mb-4 text-lg font-semibold">
          Configure Push Notification
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-navy">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={config.title}
              onChange={handleInputChange}
              placeholder="Notification Title"
              className="border-green focus:ring-green-light"
            />
          </div>
          <div>
            <Label htmlFor="body" className="text-navy">
              Body
            </Label>
            <Textarea
              id="body"
              name="body"
              value={config.body}
              onChange={handleInputChange}
              placeholder="Notification Body"
              rows={3}
              className="border-green focus:ring-green-light"
            />
          </div>
          <div>
            <Label htmlFor="topic" className="text-navy">
              Topic
            </Label>
            <Input
              id="topic"
              name="topic"
              value={config.topic}
              onChange={handleInputChange}
              placeholder="Notification Topic"
              className="border-green focus:ring-green-light"
            />
          </div>
          <Button
            onClick={handleSave}
            className="bg-primary px-2 py-1 text-sm text-primary-foreground hover:bg-primary/80"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Notification'}
          </Button>
          <p className="text-green flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            This notification will be sent to the {config.topic} topic
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-navy mb-4 text-lg font-semibold">Preview</h3>
        <Card className="bg-white-light border-green">
          <CardHeader className="flex flex-row items-center gap-4">
            <Image
              src="/placeholder.svg"
              alt="Notification Icon"
              width={48}
              height={48}
              className="rounded-full"
            />
            <CardTitle className="text-navy">
              {config.title || 'Notification Title'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-navy">
              {config.body || 'Notification body will appear here'}
            </p>
          </CardContent>
        </Card>
        <div className="text-green mt-4 flex items-center gap-2 text-sm">
          <Bell size={16} />
          <span>This is how the notification will appear on most devices</span>
        </div>
      </div>
    </div>
  );
}
