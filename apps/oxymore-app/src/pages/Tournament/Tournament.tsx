import React, { useState, useEffect } from 'react';
import { OXMDropdown } from '@oxymore/ui';
import { OXMButton } from '@oxymore/ui';
import { Grid3X3, List } from 'lucide-react';
import Pagination from '../../components/Pagination/Pagination';
import apiService from '../../api/apiService';
import type { Tournament } from '../../types/tournament';
import './Tournament.scss';

const TournamentPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchFormat, setMatchFormat] = useState('all');
  const [teamSize, setTeamSize] = useState('all');
  const [prizePool, setPrizePool] = useState('all');
  const [accessType, setAccessType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

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

  const matchFormats = [
    { label: "Match Formats", value: "all" },
    { label: "Best of 1", value: "bo1" },
    { label: "Best of 3", value: "bo3" },
    { label: "Best of 5", value: "bo5" },
  ];

  const teamSizes = [
    { label: 'Team Sizes', value: 'all' },
    { label: '1v1', value: '1v1' },
    { label: '2v2', value: '2v2' },
    { label: '5v5', value: '5v5' }
  ];

  const prizePools = [
    { label: 'Prize Pools', value: 'all' },
    { label: '0-1000€', value: 'low' },
    { label: '1000-10000€', value: 'medium' },
    { label: '10000€+', value: 'high' }
  ];

  const accessTypes = [
    { label: 'Access Types', value: 'all' },
    { label: 'Public', value: 'public' },
    { label: 'Privé', value: 'private' },
    { label: 'Premium', value: 'premium' }
  ];

  const totalPages = Math.ceil(tournaments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTournaments = tournaments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="tournament-header">
        <h1 className="tournament-title orbitron">Explore CS2 Tournaments</h1>

        <div className="category-cards">
          <div className="category-card minor" onClick={() => setMatchFormat('minor')}>
            <div className="category-image"></div>
            <h3 className="category-title">Minor</h3>
          </div>
          <div className="category-card major" onClick={() => setMatchFormat('major')}>
            <div className="category-image"></div>
            <h3 className="category-title">Major</h3>
          </div>
          <div className="category-card external" onClick={() => setMatchFormat('external')}>
            <div className="category-image"></div>
            <h3 className="category-title">External</h3>
          </div>
        </div>
      </div>

      <div className="tournament-filters">
        {React.createElement(OXMDropdown as any, {
          options: matchFormats,
          value: matchFormat,
          onChange: (value: string) => setMatchFormat(value),
          placeholder: "Match Format"
        })}
        {React.createElement(OXMDropdown as any, {
          options: teamSizes,
          value: teamSize,
          onChange: (value: string) => setTeamSize(value),
          placeholder: "Team Size"
        })}
        {React.createElement(OXMDropdown as any, {
          options: prizePools,
          value: prizePool,
          onChange: (value: string) => setPrizePool(value),
          placeholder: "Prize Pool"
        })}
        {React.createElement(OXMDropdown as any, {
          options: accessTypes,
          value: accessType,
          onChange: (value: string) => setAccessType(value),
          placeholder: "Access Type"
        })}

        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Vue cartes"
          >
            <Grid3X3 size={20} />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Vue liste"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {tournaments.length === 0 ? (
        <div className="tournament-empty">Aucun tournoi disponible</div>
      ) : (
        <div className={`tournament-grid ${viewMode === 'list' ? 'list-view' : 'cards-view'}`}>
          {paginatedTournaments.map((tournament) => (
            <div key={tournament.id_tournament} className="tournament-cards-view">
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
          ))}
        </div>
      )}

      {tournaments.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TournamentPage;
