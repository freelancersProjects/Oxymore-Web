import React, { useState, useEffect } from 'react';
import { tournamentService } from '../../services/tournamentService';
import type { Tournament } from '../../types/tournament';
import TournamentCategories from './TournamentCategories/TournamentCategories';
import TournamentFilters from './TournamentFilters/TournamentFilters';
import TournamentList from './TournamentList/TournamentList';
import TournamentSkeleton from './TournamentSkeleton/TournamentSkeleton';
import TournamentPromoBanner from './TournamentPromoBanner/TournamentPromoBanner';
import './Tournament.scss';

const TournamentPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [matchFormat, setMatchFormat] = useState('all');
  const [teamSize, setTeamSize] = useState('all');
  const [prizePool, setPrizePool] = useState('all');
  const [accessType, setAccessType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [showCategoryCards, setShowCategoryCards] = useState(true);
  const [featuredTournament, setFeaturedTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tournamentsData, configData] = await Promise.all([
          tournamentService.getAllTournaments(),
          tournamentService.getTournamentPageConfig()
        ]);
        
        setAllTournaments(tournamentsData);
        setTournaments(tournamentsData);
        setShowCategoryCards(configData.show_category_cards);
        setFeaturedTournament(configData.featured_tournament);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des tournois');
        console.error('Error fetching tournaments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...allTournaments];

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.type === selectedCategory);
    }

    if (matchFormat !== 'all') {
      const formatMap: Record<string, string> = {
        'bo1': 'BO1',
        'bo3': 'BO3',
        'bo5': 'BO5'
      };
      filtered = filtered.filter(t => t.format === formatMap[matchFormat]);
    }

    if (teamSize !== 'all') {
      filtered = filtered.filter(t => {
        const tournamentTeamSize = (t.team_size || '5V5').toUpperCase();
        const filterTeamSize = teamSize.toUpperCase();
        return tournamentTeamSize === filterTeamSize;
      });
    }

    if (prizePool !== 'all') {
      filtered = filtered.filter(t => {
        const prize = t.cash_prize || 0;
        if (prizePool === 'low') {
          return prize >= 0 && prize <= 50;
        } else if (prizePool === 'medium') {
          return prize >= 100 && prize <= 1000;
        } else if (prizePool === 'high') {
          return prize > 1000;
        }
        return true;
      });
    }

    if (accessType !== 'all') {
      if (accessType === 'premium') {
        filtered = filtered.filter(t => t.is_premium === true);
      } else if (accessType === 'public') {
        filtered = filtered.filter(t => t.type === 'open');
      } else if (accessType === 'private') {
        filtered = filtered.filter(t => t.type === 'minor' || t.type === 'major');
      }
    }

    setTournaments(filtered);
    setCurrentPage(1);
  }, [allTournaments, selectedCategory, matchFormat, teamSize, prizePool, accessType]);

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
        </div>
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
        {showCategoryCards ? (
          <TournamentCategories
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        ) : featuredTournament ? (
          <TournamentPromoBanner tournament={featuredTournament} />
        ) : null}
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
