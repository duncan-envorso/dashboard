import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PreviewContent from './PreviewContent'

interface DevicePreviewProps {
  deviceType: 'phone' 
  setDeviceType: (type: 'phone') => void
  config: {
    title: string
    imageUrl: string
    textColor: string
    buttonBackground: string
    buttonTextColor: string
    buttonText: string
  }
  comments: { id: number; text: string; isLiveFeed: boolean }[]
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ deviceType, setDeviceType, config, comments }) => (
    <Tabs defaultValue={deviceType} className="w-full">
    <TabsList>
      <TabsTrigger value="phone" onClick={() => setDeviceType('phone')}>Phone</TabsTrigger>
     
    </TabsList>
    <TabsContent value="phone" className="mt-4">
      <div className="w-[300px] h-[600px] mx-auto border-4 border-gray-200 rounded-3xl p-4 relative">
        <PreviewContent config={config} comments={comments} />
      </div>
    </TabsContent>
   
  </Tabs>
)

export default DevicePreview
