import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from 'lucide-react';
import Image from 'next/image';
import { MessageConfig } from './NotificationsComponent';

interface DevicePreviewProps {
  config: Partial<MessageConfig>;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ config }) => {
  const [deviceType, setDeviceType] = useState<'phone' | 'horizontal'>('phone');

  const ModalPreview = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 absolute inset-4 flex flex-col items-center">
      <button className="self-end mb-2">
        <X size={20} />
      </button>
      <h3 className="text-lg font-bold mb-2" style={{ color: config.textColor }}>{config.title || 'Title'}</h3>
      {config.imageUrl && (
        <Image src={config.imageUrl} width={200} height={150} alt="Preview" className="rounded-lg mb-2" />
      )}
      <p className="text-sm text-center mb-4" style={{ color: config.textColor }}>{config.body || 'Body text'}</p>
      <Button style={{ backgroundColor: config.buttonBackground, color: config.buttonTextColor }}>
        {config.buttonText || 'Button'}
      </Button>
      {config.topic && <p className="text-xs mt-2">Topic: {config.topic}</p>}
    </div>
  );

  const ImagePreview = () => (
    <div className="absolute inset-0">
      {config.imageUrl ? (
        <Image src={config.imageUrl} layout="fill" objectFit="cover" alt="Preview" className="rounded-lg" />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No image</div>
      )}
      
    </div>
  );

  const ToastPreview = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 absolute top-4 right-4 left-4 flex items-center">
      <div className="flex-grow">
        <h3 className="text-lg font-bold mb-1" style={{ color: config.textColor }}>{config.title || 'Title'}</h3>
        <p className="text-sm" style={{ color: config.textColor }}>{config.body || 'Body text'}</p>
      </div>
      <Button className="ml-4" style={{ backgroundColor: config.buttonBackground, color: config.buttonTextColor }}>
        {config.buttonText || 'Action'}
      </Button>
    </div>
  );

  const PreviewContent = () => {
    switch (config.layout) {
      case 'modal':
        return <ModalPreview />;
      case 'image':
        return <ImagePreview />;
      case 'toast':
        return <ToastPreview />;
      default:
        return <div className="text-center p-4">Please select a layout type</div>;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Device Preview</h2>
      <Tabs defaultValue="phone" className="w-full">
        <TabsList>
          <TabsTrigger value="phone" onClick={() => setDeviceType('phone')}>Phone</TabsTrigger>
          <TabsTrigger value="horizontal" onClick={() => setDeviceType('horizontal')}>Horizontal</TabsTrigger>
        </TabsList>
        <TabsContent value="phone" className="mt-4">
          <div className={`w-[300px] h-[600px] mx-auto border-4 border-gray-900 rounded-3xl p-4 relative ${deviceType === 'phone' ? '' : 'hidden'}`}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl"></div>
            <PreviewContent />
          </div>
        </TabsContent>
        <TabsContent value="horizontal" className="mt-4">
          <div className={`w-[600px] h-[300px] mx-auto border-4 border-gray-900 rounded-3xl p-4 relative ${deviceType === 'horizontal' ? '' : 'hidden'}`} >
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-12 bg-gray-900 rounded-r-xl"></div>
            <PreviewContent />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevicePreview;