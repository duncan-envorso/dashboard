// /src/utils/updateTeamColors.ts

import { teamColors, ColorScheme } from '../config/teamColors';

export function updateTeamColors(teamName: string): void {
  const colors = teamColors[teamName];
  if (!colors) {
    console.error(`No colors defined for team: ${teamName}`);
    return;
  }

  Object.entries(colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
}

export function initializeTeamColors(): void {
  const teamName = process.env.NEXT_PUBLIC_TEAM_NAME;
  if (teamName) {
    updateTeamColors(teamName);
  } else {
    console.warn('NEXT_PUBLIC_TEAM_NAME is not set in the environment variables.');
  }
}