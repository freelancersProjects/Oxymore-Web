import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tournaments/${tournament.id_tournament}`);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tournaments/${tournament.id_tournament}`);
  };

  return (
    <div className="tournament-cards-view" onClick={handleCardClick}>
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

      <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
        <OXMButton variant="primary" onClick={handleCardClick}>Join Now</OXMButton>
        <OXMButton variant="secondary" onClick={handleDetailsClick}>Tournament Details</OXMButton>
      </div>
    </div>
  );
};

export default TournamentCard;



