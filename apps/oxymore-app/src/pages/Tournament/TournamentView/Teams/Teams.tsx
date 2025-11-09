import React from 'react';
import type { Tournament } from '../../../../types/tournament';
import './Teams.scss';

interface TeamsProps {
  tournament: Tournament;
}

const Teams: React.FC<TeamsProps> = ({ tournament }) => {
  return (
    <div className="tournament-view-teams">
      <h2 className="tournament-view-section-title">Teams</h2>
      <div className="tournament-view-teams-content">
        <p>Teams content will be displayed here.</p>
        {/* TODO: Implement teams list */}
      </div>
    </div>
  );
};

export default Teams;




