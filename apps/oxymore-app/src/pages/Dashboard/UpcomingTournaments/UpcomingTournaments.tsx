import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./UpcomingTournaments.scss";
import LiveIcon from "../../../assets/svg/live-icon.svg?react";
import EyeIcon from "../../../assets/svg/eye-icon-live.svg?react";
import { OXMButton } from "@oxymore/ui";
import { tournamentService } from '../../../services/tournamentService';
import { tournamentFormatService } from '../../../services/tournamentFormatService';
import { dateFormatService } from '../../../services/dateFormatService';
import type { Tournament } from '../../../types/tournament';

export interface UpcomingTournamentsRef {
  loadMore: () => void;
  hasMore: () => boolean;
}

interface UpcomingTournamentsProps {
  onHasMoreChange?: (hasMore: boolean) => void;
}

const UpcomingTournaments = forwardRef<UpcomingTournamentsRef, UpcomingTournamentsProps>(({ onHasMoreChange }, ref) => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [displayedTournaments, setDisplayedTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const data = await tournamentService.getAllTournaments();
        const sortedTournaments = data.sort((a, b) => {
          const dateA = new Date(a.start_date).getTime();
          const dateB = new Date(b.start_date).getTime();
          return dateA - dateB;
        });
        setTournaments(sortedTournaments);
        setDisplayedTournaments(sortedTournaments.slice(0, 3));
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleLoadMore = () => {
    const nextCount = visibleCount + 3;
    setVisibleCount(nextCount);
    setDisplayedTournaments(tournaments.slice(0, nextCount));
  };

  useImperativeHandle(ref, () => ({
    loadMore: handleLoadMore,
    hasMore: () => visibleCount < tournaments.length
  }));

  useEffect(() => {
    if (onHasMoreChange) {
      onHasMoreChange(visibleCount < tournaments.length);
    }
  }, [visibleCount, tournaments.length, onHasMoreChange]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTagLabel = (tournament: Tournament, index: number): string => {
    if (tournament.type === 'major') {
      return 'Major Tournament';
    } else if (tournament.type === 'minor') {
      const minorIndex = tournaments.filter(t => t.type === 'minor').indexOf(tournament) + 1;
      return `Minor Tournament #${minorIndex}`;
    } else {
      return `${tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)} Tournament`;
    }
  };

  const getFormatLabel = (tournament: Tournament): string => {
    if (tournament.type === 'major') {
      return 'Major';
    }
    return tournamentFormatService.getFormatLabel(tournament.format);
  };

  const isLive = (tournament: Tournament): boolean => {
    const now = new Date();
    const startDate = new Date(tournament.start_date);
    const endDate = new Date(tournament.end_date);
    return now >= startDate && now <= endDate;
  };

  if (loading) {
    return (
      <section className="upcoming-tournaments">
        <h2 className="section-title orbitron">Upcoming Tournaments</h2>
        <div className="cards">
          <div className="loading-text">Loading tournaments...</div>
        </div>
      </section>
    );
  }

  if (tournaments.length === 0) {
    return (
      <section className="upcoming-tournaments">
        <h2 className="section-title orbitron">Upcoming Tournaments</h2>
        <div className="cards">
          <div className="loading-text">No tournaments available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="upcoming-tournaments">
      <h2 className="section-title orbitron">Upcoming Tournaments</h2>
      <div className="cards">
        {displayedTournaments.map((tournament, index) => {
          const live = isLive(tournament);
          return (
            <div className="card" key={tournament.id_tournament}>
              <div className="card-image-container">
                <img 
                  src={tournament.image_url || "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80"} 
                  alt={tournament.tournament_name} 
                  className="card-image" 
                />
                {live && (
                  <div className="live-badge">
                    <LiveIcon className="live-icon" /> Live
                  </div>
                )}
                <div className="views">
                  <EyeIcon /> <span>0</span>
                </div>
              </div>
              <div className="tag">
                {getTagLabel(tournament, index)} <div className="dot" />
              </div>
              <div className="title orbitron">{tournament.tournament_name}</div>
              <hr className="card-separator" />
              <div className="meta outfit">
                <span>{formatDate(tournament.start_date)}</span>
                <span>{getFormatLabel(tournament)}</span>
              </div>
              <div className="card-buttons">
                <OXMButton variant="primary" onClick={() => navigate(`/tournaments/${tournament.id_tournament}`)}>
                  Register Now
                </OXMButton>
                <OXMButton variant="secondary" onClick={() => navigate(`/tournaments/${tournament.id_tournament}`)}>
                  Tournament Details
                </OXMButton>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

UpcomingTournaments.displayName = 'UpcomingTournaments';

export default UpcomingTournaments;
