import React from 'react';
import { OXMButton } from '@oxymore/ui';
import type { Tournament } from '../../../types/tournament';
import './TournamentCard.scss';

interface TournamentCardProps {
  tournament: Tournament;
  viewMode: 'cards' | 'list';
  formatDate: (dateString: string) => string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  viewMode,
  formatDate
}) => {
  return (
    <div className="tournament-cards-view">
      <div className="card-image-container">
        <img
          src={tournament.image_url || "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=80"}
          alt={tournament.tournament_name}
          className="card-image"
        />
        <div className="tag">
          {tournament.type.toUpperCase()} <div className="dot" />
        </div>
      </div>

      <div className="title orbitron">{tournament.tournament_name}</div>

      <hr className="card-separator" />

      <div className="meta outfit">
        <span>{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</span>
        <span>{tournament.format}</span>
      </div>

      <div className="status-info">
        <span>Status: Ongoing</span>
      </div>

      <div className="card-buttons">
        <OXMButton variant="primary">Join Now</OXMButton>
        <OXMButton variant="secondary">Tournament Details</OXMButton>
      </div>
    </div>
  );
};

export default TournamentCard;



