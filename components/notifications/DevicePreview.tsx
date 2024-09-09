import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from 'lucide-react';
import Image from 'next/image';
import { MessageConfig } from '@/types';

interface DevicePreviewProps {
  config: Partial<MessageConfig>;
}

export default function Component({ config }: DevicePreviewProps = { config: {} }) {
  const ModalPreview = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 absolute inset-4 flex flex-col items-center">
      <button className="self-end mb-2 text-gray-500 hover:text-gray-700 transition-colors">
        <X size={24} />
      </button>
      <h3 className="text-xl font-bold mb-4" style={{ color: config.textColor }}>{config.title || 'Title'}</h3>
      {config.imageUrl && (
        <div className="relative w-full h-40 mb-4">
          <Image src={config.imageUrl} layout="fill" objectFit="cover" alt="Preview" className="rounded-lg" />
        </div>
      )}
      <p className="text-sm text-center mb-6" style={{ color: config.textColor }}>{config.body || 'Body text'}</p>
      <Button 
        className="w-full py-2 px-4 rounded-full transition-colors"
        style={{ backgroundColor: config.buttonBackground, color: config.buttonTextColor }}
      >
        {config.buttonText || 'Button'}
      </Button>
      {config.topic && <p className="text-xs mt-4 text-gray-500">Topic: {config.topic}</p>}
    </div>
  );

  const ImagePreview = () => (
    <div className="absolute inset-0 rounded-2xl overflow-hidden">
      {config.imageUrl ? (
        <Image src={config.imageUrl} layout="fill" objectFit="cover" alt="Preview" />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
          <span className="text-lg font-semibold">No image</span>
        </div>
      )}
    </div>
  );

  const ToastPreview = () => (
    <div className="bg-white rounded-lg shadow-md p-4 absolute top-4 right-3 left-3 flex items-start border-l-4 border-green-500">
      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1.5 flex-shrink-0" />
      <div className="flex-grow pr-4 mt-1.5 overflow-hidden">
        {config.title ? (
          <h3 className="text-xs text-primary text-gray-900 break-words">{config.title}</h3>
        ) : (
          <p className="text-xs text-gray-600 break-words">{config.body || 'Notification message'}</p>
        )}
      </div>
      <Button 
        variant="ghost"
        size="icon"
        className="shrink-0 -mt-1 -mr-2 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const PreviewContent = () => {
    switch (config.modalType) {
      case 'Modal':
        return <ModalPreview />;
      case 'Image':
        return <ImagePreview />;
      case 'Toast':
        return <ToastPreview />;
      default:
        return <div className="text-center p-4 text-gray-500">Please select a layout type</div>;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Mobile Preview</h2>
      <div className="w-[320px] h-[640px] mx-auto bg-gray-100 border-[14px] border-gray-900 rounded-[3rem] p-3 relative shadow-xl">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl"></div>
        <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
          <PreviewContent />
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-900 rounded-full"></div>
      </div>
    </div>
  );
}