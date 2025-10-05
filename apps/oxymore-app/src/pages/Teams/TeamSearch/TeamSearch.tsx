import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  Star,
  Crown,
  Shield,
  Trophy,
  TrendingUp,
  Grid3X3,
  List,
  Eye,
  UserPlus,
  MapPin
} from 'lucide-react';
import { OXMChip } from "@oxymore/ui";
import type { Team } from './types/Team';
import { ALL_TEAMS } from './data/teams';
import TeamTooltip from './TeamTooltip';
import TeamModal from './TeamModal';
import './TeamSearch.scss';

interface TeamSearchProps {
  onTeamSelect?: (team: Team) => void;
}

const TeamSearch: React.FC<TeamSearchProps> = ({ onTeamSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredTeam, setHoveredTeam] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Simuler le chargement des données
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllTeams(ALL_TEAMS);
      setFilteredTeams(ALL_TEAMS);
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = allTeams;

    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtrage par catégorie
    switch (selectedFilter) {
      case 'premium':
        filtered = filtered.filter(team => team.isPremium);
        break;
      case 'recruiting':
        filtered = filtered.filter(team => team.isRecruiting);
        break;
      case 'verified':
        filtered = filtered.filter(team => team.isVerified);
        break;
      case 'high-rated':
        filtered = filtered.filter(team => team.rating >= 4.5);
        break;
    }

    setFilteredTeams(filtered);
  }, [searchQuery, selectedFilter, allTeams]);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  const handleJoinTeam = () => {
    if (selectedTeam) {
      console.log('Rejoindre l\'équipe:', selectedTeam.name);
      // Ici tu peux ajouter la logique pour rejoindre l'équipe
    }
  };

  const handleContactTeam = () => {
    if (selectedTeam) {
      console.log('Contacter l\'équipe:', selectedTeam.name);
      // Ici tu peux ajouter la logique pour contacter l'équipe
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 80) return 'text-green-400';
    if (winRate >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="team-search-loading">
        <div className="loading-spinner">
          <Trophy className="w-8 h-8 animate-spin" />
        </div>
        <p>Chargement des équipes...</p>
      </div>
    );
  }

  return (
    <div className="team-search-container">
      <div className="team-search-content">
      {/* Header */}
      <div className="team-search-header">
        <div className="header-content">
          <h1 className="page-title">Rechercher une Équipe</h1>
          <p className="page-description">
            Découvrez les meilleures équipes et trouvez celle qui vous correspond
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une équipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="view-controls">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="filters-container">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          >
            Toutes
          </button>
          <button
            onClick={() => setSelectedFilter('premium')}
            className={`filter-btn ${selectedFilter === 'premium' ? 'active' : ''}`}
          >
            <Star className="w-4 h-4" />
            Premium
          </button>
          <button
            onClick={() => setSelectedFilter('recruiting')}
            className={`filter-btn ${selectedFilter === 'recruiting' ? 'active' : ''}`}
          >
            <UserPlus className="w-4 h-4" />
            Recrutement
          </button>
          <button
            onClick={() => setSelectedFilter('verified')}
            className={`filter-btn ${selectedFilter === 'verified' ? 'active' : ''}`}
          >
            <Shield className="w-4 h-4" />
            Vérifiées
          </button>
        </div>
      </div>

      {/* All Teams Section */}
      <div className="all-teams-section">
        <div className="section-header">
          <h2 className="section-title">
            <Users className="w-6 h-6" />
            Toutes les Équipes
            <span className="team-count">({filteredTeams.length})</span>
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${selectedFilter}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={viewMode === 'grid' ? 'teams-grid' : 'teams-list'}
          >
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={viewMode === 'grid' ? 'team-card' : 'team-list-item'}
                onClick={() => handleTeamClick(team)}
                onMouseEnter={(e) => {
                  setHoveredTeam(team);
                  setMousePosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                  setHoveredTeam(null);
                  setMousePosition(null);
                }}
                onMouseMove={(e) => {
                  setMousePosition({ x: e.clientX, y: e.clientY });
                }}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="card-header">
                      <div className="team-logo">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} />
                        ) : (
                          <Shield className="w-6 h-6" />
                        )}
                      </div>
                      <div className="team-badges">
                        {team.isVerified && (
                          <div className="badge verified">
                            <Shield className="w-4 h-4" />
                          </div>
                        )}
                        {team.isPremium && (
                          <div className="badge premium">
                            <Star className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-content">
                      <h3 className="team-name">{team.name}</h3>
                      <p className="team-description">{team.description}</p>

                      <div className="team-stats">
                        <div className="stat">
                          <span>{team.members}/{team.maxMembers}</span>
                        </div>
                        <div className="stat">
                          <span className={getRatingColor(team.rating)}>{team.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="captain-info">
                        <span>{team.captain}</span>
                      </div>
                      {team.isRecruiting && (
                        <div className="recruiting-badge">
                          <UserPlus />
                          <span>Recrute</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="list-content">
                    <div className="list-main">
                      <div className="team-info">
                        <div className="team-logo">
                          {team.logo ? (
                            <img src={team.logo} alt={team.name} />
                          ) : (
                            <Shield className="w-6 h-6" />
                          )}
                        </div>
                        <div className="team-details">
                          <div className="team-header">
                            <h3 className="team-name">{team.name}</h3>
                            <div className="team-badges">
                              {team.isVerified && (
                                <div className="badge verified">
                                  <Shield className="w-3 h-3" />
                                </div>
                              )}
                              {team.isPremium && (
                                <div className="badge premium">
                                  <Star className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="team-description">{team.description}</p>
                          <div className="team-tags">
                            {team.tags && team.tags.length > 0 ? team.tags.slice(0, 4).map(tag => (
                              <OXMChip key={tag} variant="default" size="small">
                                {tag}
                              </OXMChip>
                            )) : (
                              <span>No tags</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="team-stats">
                        <div className="stat">
                          <Users className="w-4 h-4" />
                          <span>{team.members}/{team.maxMembers}</span>
                        </div>
                        <div className="stat">
                          <Trophy className="w-4 h-4" />
                          <span className={getRatingColor(team.rating)}>{team.rating}</span>
                        </div>
                        <div className="stat">
                          <TrendingUp className="w-4 h-4" />
                          <span className={getWinRateColor(team.winRate)}>{team.winRate}%</span>
                        </div>
                        <div className="stat">
                          <MapPin className="w-4 h-4" />
                          <span>{team.region}</span>
                        </div>
                      </div>
                    </div>

                    <div className="list-footer">
                      <div className="captain-info">
                        <Crown className="w-4 h-4" />
                        <span>{team.captain}</span>
                      </div>
                      <div className="list-actions">
                        {team.isRecruiting && (
                          <div className="recruiting-badge">
                            <UserPlus className="w-4 h-4" />
                            <span>Recrute</span>
                          </div>
                        )}
                        <button className="view-btn">
                          <Eye className="w-4 h-4" />
                          <span>Voir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredTeams.length === 0 && (
          <div className="no-results">
            <Users className="w-12 h-12" />
            <h3>Aucune équipe trouvée</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        <TeamTooltip team={hoveredTeam} mousePosition={mousePosition} />
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        <TeamModal
          team={selectedTeam}
          isOpen={showModal}
          onClose={handleCloseModal}
          onJoinTeam={handleJoinTeam}
          onContactTeam={handleContactTeam}
        />
      </AnimatePresence>
    </div>
  );
};

export default TeamSearch;
