import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tournament } from '../../../types/tournament';
import './TournamentPromoBanner.scss';

interface TournamentPromoBannerProps {
  tournament: Tournament;
}

const TournamentPromoBanner: React.FC<TournamentPromoBannerProps> = ({ tournament }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tournaments/${tournament.id_tournament}`);
  };

  return (
    <div 
      className="tournament-promo-banner" 
      onClick={handleClick}
      style={tournament.image_url ? { '--image-url': `url(${tournament.image_url})` } as React.CSSProperties : undefined}
    >
      <div className="tournament-promo-banner-background"></div>
    </div>
  );
};

export default TournamentPromoBanner;

