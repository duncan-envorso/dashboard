import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    team?: string;
    teamId?: string;
    token?: string;
    tokenExpires?: number; // Add token expiration timestamp
  }

  interface Session extends DefaultSession {
    user: User & DefaultSession['user'];
    accessToken?: string;
    error?: 'RefreshAccessTokenError' | string; // Add error property
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }

  // Optionally, if you want to type the JWT payload
  interface JWT {
    id?: string;
    email?: string;
    teamId?: string;
    team?: string;
    accessToken?: string;
    tokenExpires?: number;
    error?: 'RefreshAccessTokenError' | string;
  }
}
