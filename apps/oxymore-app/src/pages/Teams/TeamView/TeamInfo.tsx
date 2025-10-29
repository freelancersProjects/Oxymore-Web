import React from 'react';
import { OXMButton } from '@oxymore/ui';
import type { Team } from '../../../types/team';
import './TeamInfo.scss';

interface TeamInfoProps {
  teamData: Team | null;
}

const TeamInfo: React.FC<TeamInfoProps> = ({ teamData }) => {
  return (
    <div className="team-info-page">
      <div className="team-banner">
        <div className="team-banner-content">
          <img
            src={teamData?.banner || teamData?.logo || '/default-banner.jpg'}
            alt="Team Banner"
            className="banner-image"
          />
          <div className="banner-overlay"></div>
        </div>
        <div className="team-banner-info">
          <img
            src={teamData?.logo || '/default-team-logo.png'}
            alt="Team Logo"
            className="team-logo-large"
          />
          <div>
            <h1 className="team-name-large">{teamData?.name || 'Loading...'}</h1>
            <p className="team-description-short">{teamData?.description || 'No description available'}</p>
          </div>
          <OXMButton variant="primary">View Public Profile</OXMButton>
        </div>
      </div>

      <div className="team-info-sections">
        <div className="info-section-card">
          <h3>Description</h3>
          <p>{teamData?.description || 'No description available'}</p>
        </div>

        <div className="info-section-card">
          <h3>Statistics</h3>
          <div className="team-stats-grid">
            <div className="stat-item">
              <span className="stat-label">Members</span>
              <span className="stat-value">{teamData?.members || 0}/{teamData?.maxMembers || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Region</span>
              <span className="stat-value">{teamData?.region || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className="stat-value">{teamData?.isVerified ? 'Verified' : 'Not Verified'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Entry</span>
              <span className="stat-value">{teamData?.entryType || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="info-section-card">
          <h3>Tournament History</h3>
          <div className="empty-state">
            <p>No tournaments yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInfo;

