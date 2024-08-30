'use client';

import React from 'react';
import ColorPicker from './ColorPicker';
import TextInput from './TextInput';
import ImageInput from './ImageInput';
import ButtonCustomizer from './ButtonCustomizer';
import DevicePreview from './DevicePreview';

export interface MessageConfig {
    layout: 'modal' | 'image' | 'banner';
    textColor: string;
    title: string;
    body: string;
    imageUrl: string;
    buttonText: string;
    buttonBackground: string;
    buttonTextColor: string;
}

interface NotificationsComponentProps {
    config: MessageConfig;
    onSave: (config: MessageConfig) => void;
}

const NotificationsComponent: React.FC<NotificationsComponentProps> = ({ config, onSave }) => {
    const [localConfig, setLocalConfig] = React.useState<MessageConfig>(config);

    const updateConfig = (key: keyof MessageConfig, value: string) => {
        setLocalConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(localConfig);
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
            <div className="mt-6">
                <button 
                    className="px-4 py-2 bg-primary text-white rounded-md" 
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default NotificationsComponent;
