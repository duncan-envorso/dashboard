'use server'
import TeamRosterDashboard from '@/components/team-roster/TeamRosterComponent'
import React from 'react'
import { apiFormattedData } from '@/public/data/team'

function TeamRosterPage() {
  return (
    <div>
      <TeamRosterDashboard apiFormattedData={apiFormattedData} />
    </div>
  )
}

export default TeamRosterPage