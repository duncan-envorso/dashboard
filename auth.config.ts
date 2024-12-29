import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  teamId: string;
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}

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
          const response = await fetch(`${process.env.NEXT_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });
          if (!response.ok) {
            console.error('Failed to authenticate user');
            return null;
          }
          const { token } = await response.json();
          const decodedToken = jwtDecode<DecodedToken>(token);
          return {
            id: decodedToken.id,
            email: credentials.email,
            teamId: decodedToken.teamId,
            team: 'seattle-seawolves',
            token,
            tokenExpires: decodedToken.exp * 1000 // Convert to milliseconds
          };
        } catch (error) {
          console.log('Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }: any) {
      if (user) {
        // Initial sign in
        token.id = user.id;
        token.email = user.email;
        token.teamId = user.teamId;
        token.team = user.team;
        token.accessToken = user.token;
        token.tokenExpires = user.tokenExpires;
      }

      // Check if token is expired
      const now = Date.now();
      if (token.tokenExpires && now >= token.tokenExpires) {
        try {
          // Attempt to refresh the token
          const response = await fetch(
            `${process.env.NEXT_API_URL}/refresh-token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
              }
            }
          );

          if (!response.ok) {
            return { ...token, error: 'RefreshAccessTokenError' };
          }

          const { token: newToken } = await response.json();
          const decodedToken = jwtDecode<DecodedToken>(newToken);

          return {
            ...token,
            accessToken: newToken,
            tokenExpires: decodedToken.exp * 1000,
            error: undefined
          };
        } catch (error) {
          console.error('Error refreshing token:', error);
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          teamId: token.teamId,
          team: token.team,
          token: token.accessToken
        };
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
    signOut: '/auth/signout',
    error: '/auth/error'
  },
  events: {
    async signOut({ session }) {
      // Optionally invalidate the token on the server when user signs out
      if (session?.accessToken) {
        try {
          await fetch(`${process.env.NEXT_API_URL}/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      }
    }
  },
  debug: process.env.NODE_ENV === 'development'
};

export default authConfig;
