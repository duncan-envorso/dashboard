'use client';

import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import TextInput from './TextInput';
import ImageInput from './ImageInput';
import ButtonCustomizer from './ButtonCustomizer';
import DevicePreview from './DevicePreview';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePicker } from './DatePicker';

export interface MessageConfig {
    teamId: string;
    layout: 'modal' | 'image' | 'toast';
    textColor: string;
    title: string;
    body: string;
    imageUrl: string;
    buttonText: string;
    buttonBackground: string;
    buttonTextColor: string;
    topic?: string;
    modalType?: 'Modal';
    expirationDate?: string;
}

interface NotificationsComponentProps {
    config?: Partial<MessageConfig>;
    onSave: (config: MessageConfig) => void;
    teamId: string;
    onNotificationSent: (status: string) => void;
}

const defaultConfig: MessageConfig = {
    layout: 'modal',
    teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
    textColor: '#000000',
    title: '',
    body: '',
    imageUrl: '',
    buttonText: '',
    buttonBackground: '#000000',
    buttonTextColor: '#ffffff',
    topic: 'miscellaneous',
    modalType: 'Modal',
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),

};

const NotificationsComponent: React.FC<NotificationsComponentProps> = ({ config, onSave, teamId, onNotificationSent }) => {
    const [localConfig, setLocalConfig] = useState<MessageConfig>({
        ...defaultConfig,
        ...config
    });

    const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

    const updateConfig = (key: keyof MessageConfig, value: string | Date | undefined) => {
        setLocalConfig(prev => ({
            ...prev,
            [key]: key === 'expirationDate' && value instanceof Date ? value.toISOString() : value
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

            const response = await fetch('https://api.seawolves.envorso.com/v1/panel/in-app-modal?teamId=3fa85f64-5717-4562-b3fc-2c963f66afa6', {
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
                    button_background_color: localConfig.buttonBackground
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to send in-app modal: ${response.status} ${response.statusText}. ${errorText}`);
            }

            const result = await response.json();
            console.log("In-app modal sent successfully:", result);
            setNotificationStatus('In-app modal sent successfully!');
            onNotificationSent('In-app modal sent successfully!');

        } catch (error) {
            console.error('Error sending in-app modal:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setNotificationStatus(`Failed to send in-app modal: ${errorMessage}`);
            onNotificationSent(`Failed to send in-app modal: ${errorMessage}`);
        }
    };

    return (
        <div className="bg-background p-4 rounded-lg border-muted-foreground shadow-md">
            <h2 className="text-2xl font-bold mb-6">In-App Notification Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Layout</Label>
                        <RadioGroup
                            value={localConfig.layout}
                            onValueChange={(value) => updateConfig('layout', value as 'modal' | 'image' | 'toast')}
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
                    <DatePicker
                        date={localConfig.expirationDate ? new Date(localConfig.expirationDate) : undefined}
                        setDate={(date: Date | undefined) => updateConfig('expirationDate', date)}
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