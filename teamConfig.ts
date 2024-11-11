export const teamConfigs: Record<string, TeamConfig> = {
    'seattle-seawolves': {
        name: 'Seattle Seawolves',
        teamId: '034db172-942f-48b8-bc91-a0b3eb3a025f',
    }
};

export interface TeamConfig {
    name: string;
    teamId: string;

}

export const currentTeam = process.env.NEXT_PUBLIC_TEAM_ID || 'seattle-seawolves';
export const currentTeamConfig = teamConfigs[currentTeam as keyof typeof teamConfigs];
console.log("currentTeamConfig", currentTeamConfig);
export const allTeams = Object.keys(teamConfigs);
