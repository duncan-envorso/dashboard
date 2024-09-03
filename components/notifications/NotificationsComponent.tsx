'use client';

import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import TextInput from './TextInput';
import ImageInput from './ImageInput';
import ButtonCustomizer from './ButtonCustomizer';
import DevicePreview from './DevicePreview';
import { Button } from "@/components/ui/button";

export interface MessageConfig {
    layout: 'modal' | 'image' | 'banner';
    textColor: string;
    title: string;
    body: string;
    imageUrl: string;
    buttonText: string;
    buttonBackground: string;
    buttonTextColor: string;
    topic: string;  // Add this line
}

interface NotificationsComponentProps {
    config: MessageConfig;
    onSave: (config: MessageConfig) => void;
    teamId: string;
    onNotificationSent: (status: string) => void;
}

const NotificationsComponent: React.FC<NotificationsComponentProps> = ({ config, onSave, teamId, onNotificationSent }) => {
    const [localConfig, setLocalConfig] = useState<MessageConfig>({
        ...config,
        topic: config.topic || 'miscelaneous'  // Set default topic
    });
    const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

    const updateConfig = (key: keyof MessageConfig, value: string) => {
        setLocalConfig(prev => ({ ...prev, [key]: value }));
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

            const response = await fetch('https://api.seawolves.envorso.com/v1/panel/notifications?teamId=034db172-942f-48b8-bc91-a0b3eb3a025f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    title: localConfig.title,
                    body: localConfig.body,
                    topic: localConfig.topic,
                    key: 'ENVORSO_HAS_THE_HIGHEST_SECURITY_KEY_EVER_$123&&'
                }),
            });

            console.log("Notification sent successfully:", response);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to send notification: ${response.status} ${response.statusText}. ${errorText}`);
            }

            const result = await response.json();
            console.log("Notification sent successfully:", result);
            setNotificationStatus('Notification sent successfully!');
            onNotificationSent('Notification sent successfully!');

        } catch (error) {
            console.error('Error sending notification:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setNotificationStatus(`Failed to send notification: ${errorMessage}`);
            onNotificationSent(`Failed to send notification: ${errorMessage}`);
        }
    };

    return (
        <div className="bg-background p-4 rounded-lg border-muted-foreground shadow-md">
            <h2 className="text-2xl font-bold mb-6">Message Layout</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <ColorPicker
                        label="Text color"
                        value={localConfig.textColor}
                        onChange={(value) => updateConfig('textColor', value)}
                    />
                    <TextInput
                        label="Title"
                        value={localConfig.title}
                        onChange={(value) => updateConfig('title', value)}
                    />
                    <TextInput
                        label="Body"
                        value={localConfig.body}
                        onChange={(value) => updateConfig('body', value)}
                        multiline
                    />
                    <TextInput
                        label="Topic"
                        value={localConfig.topic}
                        onChange={(value) => updateConfig('topic', value)}
                    />
                    <ImageInput
                        label="Image URL"
                        value={localConfig.imageUrl}
                        onChange={(value) => updateConfig('imageUrl', value)}
                    />
                    <ButtonCustomizer
                        text={localConfig.buttonText}
                        background={localConfig.buttonBackground}
                        textColor={localConfig.buttonTextColor}
                        onTextChange={(value) => updateConfig('buttonText', value)}
                        onBackgroundChange={(value) => updateConfig('buttonBackground', value)}
                        onTextColorChange={(value) => updateConfig('buttonTextColor', value)}
                    />
                </div>
                <DevicePreview config={localConfig} />
            </div>
            <div className="mt-6 space-y-4">
                <Button
                    className="mr-4"
                    onClick={handleSave}
                >
                    Save
                </Button>
                <Button
                    onClick={sendNotification}
                >
                    Send Notification
                </Button>
                {notificationStatus && <p className="mt-2">{notificationStatus}</p>}
            </div>
        </div>
    );
};

export default NotificationsComponent;