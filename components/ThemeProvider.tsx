'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Theme {
  team: string;
  // ... other theme properties
}

const ThemeContext = createContext<Theme | null>(null);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      if (session?.user?.team) {
        console.log(session.user.team);
        try {
          // Dynamically import the CSS module with the correct path
          const teamModule = await import(`@/app/styles/teams/${session.user.team}.module.css`);
          
          // Apply the styles to the document root
          document.documentElement.classList.add(teamModule.default.root);

          setTheme({ team: session.user.team });
        } catch (error) {
          console.error('Error loading team theme:', error);
          // Fallback to default theme if there's an error
          setTheme({ team: 'default' });
        }
      } else {
        setTheme({ team: 'default' });
      }
    };

    loadTheme();

    // Cleanup function to remove the class when component unmounts or theme changes
    return () => {
      document.documentElement.className = '';
    };
  }, [session]);

  if (!theme) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;