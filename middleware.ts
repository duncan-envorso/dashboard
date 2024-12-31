/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { JWT } from 'next-auth/jwt';

// Define the structure of your custom JWT token
interface CustomJWT extends JWT {
  id: string;
  email: string;
  teamId: string;
  team: string;
  accessToken: string;
}

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth?.token as CustomJWT | null;

    const response = NextResponse.next();

    if (token?.accessToken) {
      // Use the accessToken from the JWT for authorization
      response.headers.set('Authorization', `Bearer ${token.accessToken}`);

      // Add team context headers
      response.headers.set('X-Team-ID', token.teamId);
      response.headers.set('X-Team', token.team);
    }

    return response;
  },
  {
    pages: {
      signIn: '/',
      signOut: '/auth/signout',
      error: '/auth/error'
    },
    callbacks: {
      authorized: ({ token }) => {
        const customToken = token as CustomJWT | null;
        // Check if the token exists and has an accessToken
        return !!customToken?.accessToken;
      }
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path*']
};
