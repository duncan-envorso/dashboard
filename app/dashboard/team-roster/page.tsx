import TeamRosterDashboard from '@/components/team-roster/TeamRosterComponent'
import React from 'react'
import { fetchTeamData } from '@/app/actions'

async function TeamRosterPage() {
  const apiFormattedData = await fetchTeamData()
   
  
  return (
    <div><TeamRosterDashboard apiFormattedData={apiFormattedData} /></div>
  )
}

export default TeamRosterPage
