'use client';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const AuthRedirectButton = () => {
  const { data: session } = useSession();

  const handleRedirect = async () => {
    const authParam = session?.accessToken
      ? `?token=${session.accessToken}`
      : '';
    const frontendUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001';
    window.location.href = `${frontendUrl}/api/auth/signin${authParam}`;
  };

  return (
    <Button
      onClick={handleRedirect}
      className=" bg-primary text-primary-foreground hover:bg-primary/90"
    >
      Edit Seawolves Website
    </Button>
  );
};

export default AuthRedirectButton;
