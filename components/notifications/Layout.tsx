import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LayoutProps {
  layout: string;
  setLayout: (layout: 'modal' | 'image' | 'banner') => void;
}

const Layout: React.FC<LayoutProps> = ({ layout, setLayout }) => (
  <RadioGroup defaultValue={layout} onValueChange={setLayout} className="flex space-x-4">
    {['modal', 'image', 'banner'].map((type) => (
      <div key={type} className="flex flex-col items-center space-y-2">
        <RadioGroupItem value={type} id={type} className="sr-only" />
        <Label htmlFor={type} className="flex flex-col items-center cursor-pointer">
          <div className="w-16 h-24 bg-blue-100 flex items-center justify-center rounded">
            <div className={`w-10 h-16 ${type === 'modal' ? 'bg-white' : 'bg-gray-300'} rounded ${type === 'banner' ? 'w-14 h-6' : ''}`}></div>
          </div>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Label>
      </div>
    ))}
  </RadioGroup>
);

export default Layout;