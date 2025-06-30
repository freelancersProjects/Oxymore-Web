import React from 'react'
import News from './News/News'
import UpcomingTournaments from './UpcomingTournaments/UpcomingTournaments'
import './Dashboard.scss'

export const Dashboard = () => {
  return (
    <div className='container-dashboarda-app'>
        <News />
        <UpcomingTournaments />
    </div>
  )
}
