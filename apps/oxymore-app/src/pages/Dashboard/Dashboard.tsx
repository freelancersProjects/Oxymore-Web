
import News from './News/News'
import UpcomingTournaments from './UpcomingTournaments/UpcomingTournaments'
import Leaderboard from './Leaderboard/Leaderboard'
import CommunityHighlights from './CommunityHighlights/CommunityHighlights'
import { Plus } from 'lucide-react'
import './Dashboard.scss'

export const Dashboard = () => {
  return (
    <div className='container-dashboarda-app'>
        <News />
        <UpcomingTournaments />
        <div className="dashboard-separator">
          <div className="separator-line"></div>
          <button className="expand-button">
            <Plus className="expand-icon" size={28} />
          </button>
          <div className="separator-line"></div>
        </div>
        <div className="dashboard-bottom-section">
          <Leaderboard />
          <CommunityHighlights />
        </div>
    </div>
  )
}
