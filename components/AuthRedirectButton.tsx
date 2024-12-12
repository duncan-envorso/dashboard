// components/AuthRedirectButton.js
'use client';
import { useSession } from 'next-auth/react';

const AuthRedirectButton = () => {
  const { data: session } = useSession();

  const handleRedirect = async () => {
    // If user is authenticated, include their session token in the redirect
    const authParam = session?.accessToken
      ? `?token=${session.accessToken}`
      : '';

    // Get the frontend URL from environment variables, falling back to a default if not set
    const frontendUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001';

    // Redirect to the authentication page of the other application
    window.location.href = `${frontendUrl}/api/auth/signin${authParam}`;
  };

  return (
    <button
      onClick={handleRedirect}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Go to Other App
    </button>
  );
};

export default AuthRedirectButton;
