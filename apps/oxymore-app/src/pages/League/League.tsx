import React, { useState, useEffect } from 'react';
import apiService from '../../api/apiService';
import type { League } from '../../types/league';
import './League.scss';

const LeaguePage: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        const data = await apiService.get('/leagues');
        setLeagues(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des leagues');
        console.error('Error fetching leagues:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  if (loading) {
    return (
      <div className="league-container">
        <div className="league-loading">Chargement des leagues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="league-container">
        <div className="league-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="league-container">
      <h1 className="league-title">Leagues</h1>

      {leagues.length === 0 ? (
        <div className="league-empty">Aucune league disponible</div>
      ) : (
        <div className="league-grid">
          {leagues.map((league) => (
            <div key={league.id_league} className="league-card">
              {league.image_url && (
                <div className="league-image">
                  <img src={league.image_url} alt={league.league_name} />
                </div>
              )}
              <div className="league-content">
                <h3 className="league-name">{league.league_name}</h3>
                {league.max_teams && (
                  <p className="league-info">Équipes max: {league.max_teams}</p>
                )}
                {league.start_date && (
                  <p className="league-info">
                    Début: {new Date(league.start_date).toLocaleDateString()}
                  </p>
                )}
                {league.end_date && (
                  <p className="league-info">
                    Fin: {new Date(league.end_date).toLocaleDateString()}
                  </p>
                )}
                {league.entry_type && (
                  <p className="league-info">Type: {league.entry_type}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaguePage;
