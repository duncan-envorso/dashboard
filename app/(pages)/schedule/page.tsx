import React from 'react'
import ScheduleComponent from './_components/schedule-component'

export default async function SchedulePage() {
  const data = await fetch(' https://api.seawolves.envorso.com/v1/matches')
  const matchData = await data.json()

  return (
    <div><ScheduleComponent matchData={matchData} /></div>
  )
}
