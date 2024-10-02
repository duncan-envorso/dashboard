import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

// Mock user database with passwords (in a real app, passwords would be hashed)
const users = {
  'john@chicago.com': { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@chicago.com', 
    team: 'chicago-hounds',
    teamId: '17a788b5-2ac6-41d6-a320-f4d75cdd08b9',
    password: 'password123' // In a real app, this would be a hashed password
  },
  'jane@seawolves.com': { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@seawolves.com', 
    team: 'seattle-seawolves',
    teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
    password: 'password456' // In a real app, this would be a hashed password
  },
};

async function getUserFromDatabase(email: string) {
  return users[email as keyof typeof users] || null;
}

const authConfig: NextAuthConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: 'email' },
        password: { label: "Password", type: 'password' },
      },
      async authorize(credentials, req) {
        if (typeof credentials?.email !== 'string' || typeof credentials?.password !== 'string') {
          console.log('Missing email or password');
          return null;
        }
        const user = await getUserFromDatabase(credentials.email);
        if (user && user.password === credentials.password) { // In a real app, use a proper password comparison
          console.log('User authenticated:', user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            team: user.team,
            teamId: user.teamId, // Include teamId here
          };
        }
        console.log('Authentication failed for:', credentials.email);
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.team = user.team;
        token.teamId = user.teamId;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as any).team = token.team;
        (session.user as any).teamId = token.teamId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default authConfig;