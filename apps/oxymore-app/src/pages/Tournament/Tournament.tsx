import React, { useState, useEffect } from 'react';
import apiService from '../../api/apiService';
import type { Tournament } from '../../types/tournament';
import './Tournament.scss';

const TournamentPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const data = await apiService.get('/tournaments');
        setTournaments(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des tournois');
        console.error('Error fetching tournaments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'major':
        return '#ffd700';
      case 'minor':
        return '#c0c0c0';
      case 'ligue':
        return '#cd7f32';
      case 'open':
        return '#4CAF50';
      default:
        return '#ffffff';
    }
  };

  if (loading) {
    return (
      <div className="tournament-container">
        <div className="tournament-loading">Chargement des tournois...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournament-container">
        <div className="tournament-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="tournament-container">
      <h1 className="tournament-title">Tournois</h1>

      {tournaments.length === 0 ? (
        <div className="tournament-empty">Aucun tournoi disponible</div>
      ) : (
        <div className="tournament-grid">
          {tournaments.map((tournament) => (
            <div key={tournament.id_tournament} className="tournament-card">
              {tournament.image_url && (
                <div className="tournament-image">
                  <img src={tournament.image_url} alt={tournament.tournament_name} />
                </div>
              )}
              <div className="tournament-content">
                <div className="tournament-header">
                  <h3 className="tournament-name">{tournament.tournament_name}</h3>
                  <span
                    className="tournament-type"
                    style={{ color: getTypeColor(tournament.type) }}
                  >
                    {tournament.type.toUpperCase()}
                  </span>
                </div>

                {tournament.description && (
                  <p className="tournament-description">{tournament.description}</p>
                )}

                <div className="tournament-details">
                  <div className="tournament-info">
                    <span className="info-label">Format:</span>
                    <span className="info-value">{tournament.format}</span>
                  </div>

                  <div className="tournament-info">
                    <span className="info-label">Structure:</span>
                    <span className="info-value">{tournament.structure}</span>
                  </div>

                  <div className="tournament-info">
                    <span className="info-label">Début:</span>
                    <span className="info-value">{formatDate(tournament.start_date)}</span>
                  </div>

                  <div className="tournament-info">
                    <span className="info-label">Fin:</span>
                    <span className="info-value">{formatDate(tournament.end_date)}</span>
                  </div>

                  {tournament.cash_prize && (
                    <div className="tournament-info">
                      <span className="info-label">Prix:</span>
                      <span className="info-value">{tournament.cash_prize}€</span>
                    </div>
                  )}

                  {tournament.entry_fee && (
                    <div className="tournament-info">
                      <span className="info-label">Frais d'inscription:</span>
                      <span className="info-value">{tournament.entry_fee}€</span>
                    </div>
                  )}

                  {tournament.max_participant && (
                    <div className="tournament-info">
                      <span className="info-label">Participants max:</span>
                      <span className="info-value">{tournament.max_participant}</span>
                    </div>
                  )}

                  {tournament.is_premium && (
                    <div className="tournament-premium">Premium</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentPage;
