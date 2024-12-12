// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

// Use NextAuth to create a handler with the correct configuration
const handler = NextAuth(authConfig);

// Export the `GET` and `POST` handlers
export const GET = handler;
export const POST = handler;
