// auth.ts (in the root directory, NOT in app folder)
import NextAuth, { NextAuthOptions } from 'next-auth';
import authConfig from './auth.config';

export const authOptions: NextAuthOptions = authConfig;

// Create NextAuth handler for API routes
const handler = NextAuth(authOptions);

export const handlers = {
  GET: handler,
  POST: handler
};

export default handler; // Optional: Default export for general use
