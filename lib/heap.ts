/* eslint-disable no-unused-vars */
// File: lib/heap.ts

// Extend the Window interface to include the Heap object
declare global {
  interface Window {
    heap?: {
      identify: (email: string) => void;
      addUserProperties: (properties: Record<string, any>) => void;
      clearEventProperties: () => void;
      resetIdentity: () => void;
      removeEventProperty: (property: string) => void;
      setEventProperties: (properties: Record<string, any>) => void;
      track: (event: string, properties?: Record<string, any>) => void;
      unsetEventProperty: (property: string) => void;
    };
  }
}

export const identifyUser = (email: string): void => {
  if (typeof window !== 'undefined' && window.heap) {
    window.heap.identify(email);
  } else {
    console.warn('Unable to identify user: window.heap is not available');
  }
};

export const addUserProperties = (properties: Record<string, any>): void => {
  if (typeof window !== 'undefined' && window.heap) {
    window.heap.addUserProperties(properties);
  } else {
    console.warn('Unable to add user properties: window.heap is not available');
  }
};
