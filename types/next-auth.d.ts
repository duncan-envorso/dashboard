import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    team?: string;
    teamId?: string;
  }

  interface Session extends DefaultSession {
    user: User & DefaultSession['user'];
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}