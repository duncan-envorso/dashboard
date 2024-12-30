import { MessageConfig } from '@/types';

// /lib/constants.ts
// /lib/constants.ts
// /lib/constants.ts
export const initialConfig: MessageConfig = {
  type: 'Modal',
  title: 'Live Rugby Match',
  id: '', // Add the missing id property
  body: '', // Add the missing body property
  status: 'Scheduled', // Set the status to 'Scheduled'
  imageUrl: '/placeholder.svg?height=300&width=400',
  buttonText: 'Watch Now',
  textColor: '#000000',
  buttonBackground: '#4CAF50',
  buttonTextColor: '#FFFFFF',
  createdAt: new Date(), // Add the missing createdAt property
  createdBy: '', // Add the missing createdBy property
  updatedAt: new Date() // Add the missing updatedAt property
};
