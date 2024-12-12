// /components/live-commentary/DeviceContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type DeviceType = 'phone' | 'Horisontal';

interface DeviceContextType {
  deviceType: DeviceType;
  setDeviceType: (type: DeviceType) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [deviceType, setDeviceType] = useState<DeviceType>('phone');

  return (
    <DeviceContext.Provider value={{ deviceType, setDeviceType }}>
      {children}
    </DeviceContext.Provider>
  );
}

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
