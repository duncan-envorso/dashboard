'use server'

import TeamRosterDashboard from '@/components/team-roster/TeamRosterComponent'
import React from 'react'

import { initialPlayers } from '@/public/data/team'

function TeamRosterPage() {
  return (
    <div>
      <TeamRosterDashboard initialPlayers={initialPlayers} />
    </div>
  )
}

export default TeamRosterPage