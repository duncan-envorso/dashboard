'use client'

import React, { useState } from 'react';
import Layout from '../../../components/notifications/Layout';
import ColorPicker from '../../../components/notifications/ColorPicker';
import TextInput from '../../../components/notifications/TextInput';
import ImageInput from '../../../components/notifications/ImageInput';
import ButtonCustomizer from '../../../components/notifications/ButtonCustomizer';
import DevicePreview from '../../../components/notifications/DevicePreview';

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

const MessageCustomizer: React.FC = () => {
  const [config, setConfig] = useState<MessageConfig>({
    layout: 'modal',
   
    textColor: '#000000',
    title: 'Back of the Year 2024',
    body: 'TReece MacDonald: Major League Rugby Back of the Year 2024',
    imageUrl: 'https://freejacks.com/wp-content/uploads/2024/08/Reece-1.jpg',
    buttonText: 'Share',
    buttonBackground: '#fb0055',
    buttonTextColor: '#ffffff',
  });

  const updateConfig = (key: keyof MessageConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Message Layout</h2>
        <Layout layout={config.layout} setLayout={(layout) => updateConfig('layout', layout)} />
        <div className="space-y-4">
          <ColorPicker label="Text color" value={config.textColor} onChange={(value) => updateConfig('textColor', value)} />
          <TextInput label="Title" value={config.title} onChange={(value) => updateConfig('title', value)} />
          <TextInput label="Body" value={config.body} onChange={(value) => updateConfig('body', value)} multiline />
          <ImageInput label="Image URL" value={config.imageUrl} onChange={(value) => updateConfig('imageUrl', value)} />
          <ButtonCustomizer
            text={config.buttonText}
            background={config.buttonBackground}
            textColor={config.buttonTextColor}
            onTextChange={(value) => updateConfig('buttonText', value)}
            onBackgroundChange={(value) => updateConfig('buttonBackground', value)}
            onTextColorChange={(value) => updateConfig('buttonTextColor', value)}
          />
        </div>
      </div>
      <DevicePreview config={config} />
    </div>
  );
};

export default MessageCustomizer;