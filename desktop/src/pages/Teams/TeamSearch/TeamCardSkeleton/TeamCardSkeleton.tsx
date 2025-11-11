import React from 'react';
import { OXMSkeleton } from "@oxymore/ui";
import './TeamCardSkeleton.scss';

const TeamCardSkeleton: React.FC = () => {
  return (
    <div className="team-card-skeleton">
      <div className="team-card-skeleton-header">
        <OXMSkeleton variant="circular" width="60px" height="60px" theme="purple" animation="purple-pulse" />
        <div className="team-card-skeleton-info">
          <OXMSkeleton width="120px" height="20px" theme="blue" animation="blue-pulse" />
          <OXMSkeleton width="80px" height="16px" theme="purple" animation="purple-pulse" />
        </div>
        <OXMSkeleton variant="circular" width="32px" height="32px" theme="blue" animation="blue-pulse" />
      </div>

      <div className="team-card-skeleton-content">
        <OXMSkeleton lines={2} theme="gradient" animation="purple-pulse" />
        <div className="team-card-skeleton-tags">
          <OXMSkeleton width="60px" height="24px" borderRadius="12px" theme="purple" animation="blue-pulse" />
          <OXMSkeleton width="80px" height="24px" borderRadius="12px" theme="blue" animation="purple-pulse" />
        </div>
      </div>

      <div className="team-card-skeleton-footer">
        <div className="team-card-skeleton-stats">
          <OXMSkeleton width="40px" height="16px" theme="blue" animation="purple-pulse" />
          <OXMSkeleton width="40px" height="16px" theme="purple" animation="blue-pulse" />
          <OXMSkeleton width="40px" height="16px" theme="gradient" animation="purple-pulse" />
        </div>
        <OXMSkeleton width="100px" height="32px" borderRadius="16px" theme="purple" animation="blue-pulse" />
      </div>
    </div>
  );
};

export default TeamCardSkeleton;
