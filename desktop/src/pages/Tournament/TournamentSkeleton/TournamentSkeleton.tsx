import React from 'react';
import { OXMSkeleton } from '@oxymore/ui';
import './TournamentSkeleton.scss';

const TournamentSkeleton: React.FC = () => {
  return (
    <div className="tournament-skeleton-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="tournament-card-skeleton">
          <OXMSkeleton width="100%" height="200px" theme="purple" animation="purple-pulse" />
          <OXMSkeleton width="80%" height="24px" theme="purple" animation="blue-pulse" />
          <OXMSkeleton width="60%" height="20px" theme="blue" animation="purple-pulse" />
          <OXMSkeleton width="50%" height="20px" theme="purple" animation="blue-pulse" />
        </div>
      ))}
    </div>
  );
};

export default TournamentSkeleton;

