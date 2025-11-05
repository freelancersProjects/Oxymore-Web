import React from 'react';
import type { Tournament } from '../../../../types/tournament';
import './Bracket.scss';

interface BracketProps {
  tournament: Tournament;
}

const Bracket: React.FC<BracketProps> = ({ tournament }) => {
  return (
    <div className="tournament-view-bracket">
      <h2 className="tournament-view-section-title">Bracket</h2>
      <div className="tournament-view-bracket-content">
        <p>Bracket content will be displayed here.</p>
        {/* TODO: Implement bracket visualization */}
      </div>
    </div>
  );
};

export default Bracket;




