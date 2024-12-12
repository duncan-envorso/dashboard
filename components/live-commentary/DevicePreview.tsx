import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PreviewContent from './PreviewContent';

interface DevicePreviewProps {
  deviceType: 'phone' | 'Horisontal';
  setDeviceType: (type: 'phone' | 'Horisontal') => void;
  config: {
    title: string;
    imageUrl: string;
    textColor: string;
    buttonBackground: string;
    buttonTextColor: string;
    buttonText: string;
  };
  comments: { id: number; text: string; isLiveFeed: boolean }[];
  onDeleteComment: (id: number) => void; // Added this
  onEditComment: (id: number, newText: string) => void; // Added this
}

const DevicePreview: React.FC<DevicePreviewProps> = ({
  deviceType,
  setDeviceType,
  config,
  comments
}) => (
  <Tabs defaultValue={deviceType} className="w-full">
    <TabsList>
      <TabsTrigger value="phone" onClick={() => setDeviceType('phone')}>
        Phone
      </TabsTrigger>
      <TabsTrigger
        value="Horisontal"
        onClick={() => setDeviceType('Horisontal')}
      >
        Horizontal
      </TabsTrigger>
    </TabsList>
    <TabsContent value="phone" className="mt-4">
      <div className="relative mx-auto h-[600px] w-[300px] rounded-3xl border-4 border-gray-200 p-4">
        <PreviewContent config={config} comments={comments} />
      </div>
    </TabsContent>
    <TabsContent value="Horisontal" className="mt-4">
      <div className="relative mx-auto h-[300px] w-[600px] rounded-3xl border-4 border-gray-200 p-4">
        <PreviewContent config={config} comments={comments} />
      </div>
    </TabsContent>
  </Tabs>
);

export default DevicePreview;
