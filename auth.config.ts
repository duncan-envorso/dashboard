import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { jwtDecode } from 'jwt-decode';

const authConfig: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing email or password');
          return null;
        }

        try {
          const response = await fetch(
            'https://api.seawolves.envorso.com/v1/login',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
              })
            }
          );

          if (!response.ok) {
            console.error('Failed to authenticate user');
            return null;
          }

          const { token } = await response.json();
          const decodedToken = jwtDecode<{ id: string; teamId: string }>(token);

          // Return the user object with token information
          return {
            id: decodedToken.id,
            email: credentials.email,
            teamId: decodedToken.teamId,
            team: 'seattle-seawolves', // Add a placeholder team name
            token
          };
        } catch (error) {
          console.log('Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Store user details and accessToken in the JWT
        token.id = user.id;
        token.email = user.email;
        token.teamId = user.teamId;
        token.team = user.team;
        token.accessToken = user.token; // Store accessToken in JWT token
      }
      return token; // Pass token forward
    },
    async session({ session, token }: any) {
      if (token) {
        // Store user details and accessToken in the session
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          teamId: token.teamId,
          team: token.team,
          token: token.accessToken
        };
        session.accessToken = token.accessToken; // Store accessToken in session
      }
      return session; // Return updated session with the accessToken
    }
  },
  pages: {
    signIn: '/',
    signOut: '/auth/signout',
    error: '/auth/error'
  },
  debug: process.env.NODE_ENV === 'development'
};

export default authConfig;
