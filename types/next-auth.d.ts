import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    team?: string;
    teamId?: string;
    token?: string; // Adding token property to the user
  }

  interface Session extends DefaultSession {
    user: User & DefaultSession['user']; // Extending user to include token and other details
    accessToken?: string; // Adding accessToken to the session
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
