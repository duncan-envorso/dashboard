import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from 'lucide-react';
import { MessageConfig } from '../../app/dashboard/notifications/page';
import Image from 'next/image';

interface DevicePreviewProps {
  config: MessageConfig;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ config }) => {
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet'>('phone');

  const PreviewContent = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 absolute inset-4 flex flex-col items-center">
      <button className="self-end mb-2">
        <X size={20} />
      </button>
      <h3 className="text-lg font-bold mb-2" style={{ color: config.textColor }}>{config.title}</h3>
      <Image src={config.imageUrl} width={400} height={300} alt="Preview" className=" rounded-lg mb-2" />
      <p className="text-sm text-center mb-4" style={{ color: config.textColor }}>{config.body}</p>
      <Button style={{ backgroundColor: config.buttonBackground, color: config.buttonTextColor }}>{config.buttonText}</Button>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Device Preview</h2>
      <Tabs defaultValue="phone" className="w-full">
        <TabsList>
          <TabsTrigger value="phone" onClick={() => setDeviceType('phone')}>Phone</TabsTrigger>
          <TabsTrigger value="tablet" onClick={() => setDeviceType('tablet')}>Tablet</TabsTrigger>
        </TabsList>
        <TabsContent value="phone" className="mt-4">
          <div className={`w-[300px] h-[600px] mx-auto border-4 border-gray-900 rounded-3xl p-4 relative ${deviceType === 'phone' ? '' : 'hidden'}`} style={{ backgroundColor: config.background }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl"></div>
            {config.layout === 'modal' && <PreviewContent />}
          </div>
        </TabsContent>
        <TabsContent value="tablet" className="mt-4">
          <div className={`w-[500px] h-[350px] mx-auto border-4 border-gray-900 rounded-3xl p-4 relative ${deviceType === 'tablet' ? '' : 'hidden'}`} style={{ backgroundColor: config.background }}>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-12 bg-gray-900 rounded-r-xl"></div>
            {config.layout === 'modal' && (
              <div className="bg-white rounded-lg shadow-lg p-4 absolute inset-4 flex items-center justify-center">
                <button className="absolute top-2 right-2">
                  <X size={20} />
                </button>
                <div className="flex items-center space-x-4">
                  <Image src={config.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  <div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: config.textColor }}>{config.title}</h3>
                    <p className="text-sm mb-4" style={{ color: config.textColor }}>{config.body}</p>
                    <Button style={{ backgroundColor: config.buttonBackground, color: config.buttonTextColor }}>{config.buttonText}</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevicePreview;