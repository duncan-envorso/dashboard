/* eslint-disable no-console */
import TeamRosterDashboard from '@/components/team-roster/TeamRosterComponent';
import React from 'react';
import { fetchTeamData } from '@/app/actions';

export default async function TeamRosterPage() {
  try {
    const apiFormattedData = await fetchTeamData();

    // Proper null check including empty objects
    if (!apiFormattedData || Object.keys(apiFormattedData).length === 0) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-lg text-muted-foreground">Please Add Members</p>
        </div>
      );
    }

    return (
      <div>
        <TeamRosterDashboard apiFormattedData={apiFormattedData} />
      </div>
    );
  } catch (error) {
    console.log('Error fetching team data:', error);
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-red-500">
          Error loading team roster. Please try again later.
        </p>
      </div>
    );
  }
}
