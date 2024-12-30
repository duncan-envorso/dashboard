import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';
import Image from 'next/image';
import { MessageConfig } from '@/types';

interface DevicePreviewProps {
  config: Partial<MessageConfig>;
}

export default function Component(
  { config }: DevicePreviewProps = { config: {} }
) {
  const ModalPreview = () => (
    <div className="absolute inset-4 flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
      <button className="mb-2 self-end text-gray-500 transition-colors hover:text-gray-700">
        <X size={24} />
      </button>
      <h3
        className="mb-4 text-xl font-bold"
        style={{ color: config.textColor }}
      >
        {config.title || 'Title'}
      </h3>
      {config.imageUrl && (
        <div className="relative mb-4 h-40 w-full">
          <Image
            src={config.imageUrl}
            layout="fill"
            objectFit="cover"
            alt="Preview"
            className="rounded-lg"
          />
        </div>
      )}
      <p
        className="mb-6 text-center text-sm"
        style={{ color: config.textColor }}
      >
        {config.body || 'Body text'}
      </p>
      <Button
        className="w-full rounded-full px-4 py-2 transition-colors"
        style={{
          backgroundColor: config.buttonBackground,
          color: config.buttonTextColor
        }}
      >
        {config.buttonText || 'Button'}
      </Button>
      {config.topic && (
        <p className="mt-4 text-xs text-gray-500">Topic: {config.topic}</p>
      )}
    </div>
  );

  const ImagePreview = () => (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      {config.imageUrl ? (
        <Image
          src={config.imageUrl}
          layout="fill"
          objectFit="cover"
          alt="Preview"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
          <span className="text-lg font-semibold">No image</span>
        </div>
      )}
    </div>
  );

  const ToastPreview = () => (
    <div className="absolute left-3 right-3 top-4 flex items-start rounded-lg border-l-4 border-green-500 bg-white p-4 shadow-md">
      <CheckCircle className="mr-3 mt-1.5 h-5 w-5 flex-shrink-0 text-green-500" />
      <div className="mt-1.5 flex-grow overflow-hidden pr-4">
        {config.title ? (
          <h3 className="break-words text-xs text-gray-900 text-primary">
            {config.title}
          </h3>
        ) : (
          <p className="break-words text-xs text-gray-600">
            {config.body || 'Notification message'}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="-mr-2 -mt-1 shrink-0 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const PreviewContent = () => {
    switch (config.type) {
      case 'Modal':
        return <ModalPreview />;
      case 'Image':
        return <ImagePreview />;
      case 'Toast':
        return <ToastPreview />;
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Please select a layout type
          </div>
        );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="mb-6 text-center text-2xl font-bold">Mobile Preview</h2>
      <div className="relative mx-auto h-[640px] w-[320px] rounded-[3rem] border-[14px] border-gray-900 bg-gray-100 p-3 shadow-xl">
        <div className="absolute left-1/2 top-0 h-6 w-1/3 -translate-x-1/2 transform rounded-b-xl bg-gray-900"></div>
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
          <PreviewContent />
        </div>
        <div className="absolute bottom-4 left-1/2 h-1 w-1/3 -translate-x-1/2 transform rounded-full bg-gray-900"></div>
      </div>
    </div>
  );
}
