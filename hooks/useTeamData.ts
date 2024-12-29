import useSWR from 'swr';
import { CombinedTeamData } from '@/types/team';
import { currentTeamConfig } from '@/teamConfig';

const fetcher = async (): Promise<CombinedTeamData> => {
  if (!currentTeamConfig) {
    throw new Error('Team config not found');
  }

  const teamId = '034db172-942f-48b8-bc91-a0b3eb3a025f';
  const baseUrl = `${process.env.NEXT_API_URL}/teams`;
  const requestConfig = {
    headers: {
      'x-client-app-version': '2.0.17'
    }
  };

  const [rosterResponse, staffResponse] = await Promise.all([
    fetch(`${baseUrl}/${teamId}/roster`, requestConfig),
    fetch(`${baseUrl}/${teamId}/staff`, requestConfig)
  ]);

  if (!rosterResponse.ok || !staffResponse.ok) {
    throw new Error(
      `Failed to fetch data: ${!rosterResponse.ok ? 'roster' : ''} ${
        !staffResponse.ok ? 'staff' : ''
      }`
    );
  }

  const [roster, staff] = await Promise.all([
    rosterResponse.json(),
    staffResponse.json()
  ]);

  return {
    roster,
    staff
  };
};

export function useTeamData() {
  const { data, error, isLoading, mutate } = useSWR<CombinedTeamData>(
    'team-data',
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate on window focus
      revalidateOnReconnect: true, // Revalidate when browser regains connection
      refreshInterval: 30000 // Refresh every 30 seconds (adjust as needed)
    }
  );

  return {
    teamData: data,
    isLoading,
    isError: error,
    mutate // Use this to manually refresh data
  };
}
