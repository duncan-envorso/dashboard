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

    // Redirect to the authentication page of the other application
    window.location.href = `http://localhost:3001/api/auth/signin${authParam}`;
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
