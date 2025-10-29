import React, { useState, useEffect } from 'react';
import { tournamentService } from '../../services/tournamentService';
import type { Tournament } from '../../types/tournament';
import TournamentCategories from './TournamentCategories/TournamentCategories';
import TournamentFilters from './TournamentFilters/TournamentFilters';
import TournamentList from './TournamentList/TournamentList';
import TournamentSkeleton from './TournamentSkeleton/TournamentSkeleton';
import './Tournament.scss';

const TournamentPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('minor');
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
        const data = await tournamentService.getAllTournaments();
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="tournament-container">
        <div className="tournament-header">
          <h1 className="tournament-title orbitron">Explore CS2 Tournaments</h1>
          <TournamentCategories
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>
        <TournamentFilters
          matchFormat={matchFormat}
          setMatchFormat={setMatchFormat}
          teamSize={teamSize}
          setTeamSize={setTeamSize}
          prizePool={prizePool}
          setPrizePool={setPrizePool}
          accessType={accessType}
          setAccessType={setAccessType}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <TournamentSkeleton />
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
        <TournamentCategories
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </div>

      <TournamentFilters
        matchFormat={matchFormat}
        setMatchFormat={setMatchFormat}
        teamSize={teamSize}
        setTeamSize={setTeamSize}
        prizePool={prizePool}
        setPrizePool={setPrizePool}
        accessType={accessType}
        setAccessType={setAccessType}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <TournamentList
        tournaments={tournaments}
        viewMode={viewMode}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        formatDate={formatDate}
      />
    </div>
  );
};

export default TournamentPage;
