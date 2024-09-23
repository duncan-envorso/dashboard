// /src/config/teamColors.ts

export type ColorScheme = {
    background: string;
    foreground: string;
    muted: string;
    'muted-foreground': string;
    popover: string;
    'popover-foreground': string;
    card: string;
    'card-foreground': string;
    border: string;
    input: string;
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    accent: string;
    'accent-foreground': string;
    destructive: string;
    'destructive-foreground': string;
    ring: string;
  };
  
  export type TeamColors = {
    [key: string]: ColorScheme;
  };
  
  export const teamColors: TeamColors = {
    team1: {
      background: '0 100% 50%',
      foreground: '20 51% 4%',
      muted: '20 25% 86%',
      'muted-foreground': '20 7% 25%',
      popover: '20 66% 98%',
      'popover-foreground': '20 51% 3%',
      card: '20 66% 98%',
      'card-foreground': '20 51% 3%',
      border: '20 15% 94%',
      input: '20 15% 94%',
      primary: '20 48% 72%',
      'primary-foreground': '20 48% 12%',
      secondary: '20 12% 92%',
      'secondary-foreground': '20 12% 32%',
      accent: '20 12% 92%',
      'accent-foreground': '20 12% 32%',
      destructive: '11 80% 22%',
      'destructive-foreground': '11 80% 82%',
      ring: '20 48% 72%'
    },
   
    // ... define colors for other teams
  };