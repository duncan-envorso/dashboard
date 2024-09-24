'use server'

import React from 'react'
import { apiFormattedData } from '@/public/data/team'
import TeamRosterView from './_components/team-roster'

function TeamRosterPage() {
  return (
    <TeamRosterView apiFormattedData={apiFormattedData} />
  )
}

export default TeamRosterPage