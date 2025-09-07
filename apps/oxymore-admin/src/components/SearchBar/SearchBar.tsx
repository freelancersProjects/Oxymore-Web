import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Trophy, Shield, Target, Calendar, Star, FileText, CheckSquare, ArrowRight, Command } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'tournament' | 'team' | 'league' | 'match' | 'badge' | 'document' | 'ticket';
  url: string;
  icon: React.ReactNode;
  category: string;
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Search anything... (⌘ K)'
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Données réelles de l'application Oxymore
  const mockData: SearchResult[] = [
    // Utilisateurs réels
    { id: '1', title: 'Mathis Boulais', description: 'Administrateur • mathis.boulais@oxymore.com', type: 'user', url: '/users/1', icon: <Users className="w-4 h-4" />, category: 'Users' },
    { id: '2', title: 'Alex D.', description: 'Développeur • alex.d@oxymore.com', type: 'user', url: '/users/2', icon: <Users className="w-4 h-4" />, category: 'Users' },
    { id: '3', title: 'Sarah L.', description: 'Testeuse • sarah.l@oxymore.com', type: 'user', url: '/users/3', icon: <Users className="w-4 h-4" />, category: 'Users' },

    // Tournois Oxymore
    { id: '4', title: 'Oxymore Championship', description: 'Tournoi majeur • 32 équipes • 50,000€', type: 'tournament', url: '/tournaments/4', icon: <Trophy className="w-4 h-4" />, category: 'Tournaments' },
    { id: '5', title: 'Pro League Season 1', description: 'Ligue professionnelle • 16 équipes', type: 'tournament', url: '/tournaments/5', icon: <Trophy className="w-4 h-4" />, category: 'Tournaments' },
    { id: '6', title: 'Challenger Cup', description: 'Tournoi amateur • 64 équipes', type: 'tournament', url: '/tournaments/6', icon: <Trophy className="w-4 h-4" />, category: 'Tournaments' },

    // Équipes Oxymore
    { id: '7', title: 'Oxymore Elite', description: 'Équipe principale • 5 joueurs • Vérifiée', type: 'team', url: '/teams/7', icon: <Shield className="w-4 h-4" />, category: 'Teams' },
    { id: '8', title: 'Team Phoenix', description: 'Équipe esport • 6 joueurs • Actif', type: 'team', url: '/teams/8', icon: <Shield className="w-4 h-4" />, category: 'Teams' },
    { id: '9', title: 'Dragon Squad', description: 'Équipe compétitive • 5 joueurs • Actif', type: 'team', url: '/teams/9', icon: <Shield className="w-4 h-4" />, category: 'Teams' },

    // Ligues Oxymore
    { id: '10', title: 'Oxymore Pro League', description: 'Ligue professionnelle • 8 équipes', type: 'league', url: '/leagues/10', icon: <Target className="w-4 h-4" />, category: 'Leagues' },
    { id: '11', title: 'Challenger Series', description: 'Série challenger • 16 équipes', type: 'league', url: '/leagues/11', icon: <Target className="w-4 h-4" />, category: 'Leagues' },
    { id: '12', title: 'Amateur League', description: 'Ligue amateur • 32 équipes', type: 'league', url: '/leagues/12', icon: <Target className="w-4 h-4" />, category: 'Leagues' },

    // Matchs Oxymore
    { id: '13', title: 'Oxymore Elite vs Team Phoenix', description: 'Match en cours • BO3 • Live', type: 'match', url: '/matches/13', icon: <Calendar className="w-4 h-4" />, category: 'Matches' },
    { id: '14', title: 'Dragon Squad vs Team Alpha', description: 'Match à venir • BO5 • 20:00', type: 'match', url: '/matches/14', icon: <Calendar className="w-4 h-4" />, category: 'Matches' },
    { id: '15', title: 'Championship Final', description: 'Finale • BO5 • 25,000€', type: 'match', url: '/matches/15', icon: <Calendar className="w-4 h-4" />, category: 'Matches' },

    // Badges Oxymore
    { id: '16', title: 'Champion Badge', description: 'Badge pour les champions de tournoi', type: 'badge', url: '/badges/16', icon: <Star className="w-4 h-4" />, category: 'Badges' },
    { id: '17', title: 'Pro Player Badge', description: 'Badge pour les joueurs professionnels', type: 'badge', url: '/badges/17', icon: <Star className="w-4 h-4" />, category: 'Badges' },
    { id: '18', title: 'Moderator Badge', description: 'Badge pour les modérateurs', type: 'badge', url: '/badges/18', icon: <Star className="w-4 h-4" />, category: 'Badges' },

    // Documents Confluence Oxymore
    { id: '19', title: 'Guide d\'intégration API', description: 'Documentation technique • Confluence', type: 'document', url: '/confluence', icon: <FileText className="w-4 h-4" />, category: 'Documents' },
    { id: '20', title: 'Notes de réunion - Sprint Planning', description: 'Réunion équipe • Confluence', type: 'document', url: '/confluence', icon: <FileText className="w-4 h-4" />, category: 'Documents' },
    { id: '21', title: 'Procédure de déploiement', description: 'Guide de déploiement • Confluence', type: 'document', url: '/confluence', icon: <FileText className="w-4 h-4" />, category: 'Documents' },

    // Tickets Jira Oxymore
    { id: '22', title: 'Refonte de l\'interface utilisateur', description: 'Ticket Jira • En cours • Haute priorité', type: 'ticket', url: '/jira', icon: <CheckSquare className="w-4 h-4" />, category: 'Tickets' },
    { id: '23', title: 'Optimisation des performances', description: 'Ticket Jira • À faire • Moyenne priorité', type: 'ticket', url: '/jira', icon: <CheckSquare className="w-4 h-4" />, category: 'Tickets' },
    { id: '24', title: 'Tests unitaires', description: 'Ticket Jira • Terminé • Basse priorité', type: 'ticket', url: '/jira', icon: <CheckSquare className="w-4 h-4" />, category: 'Tickets' },
    { id: '25', title: 'Documentation API', description: 'Ticket Jira • À faire • Urgent', type: 'ticket', url: '/jira', icon: <CheckSquare className="w-4 h-4" />, category: 'Tickets' }
  ];

  // Recherche avec debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const filteredResults = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8); // Limiter à 8 résultats

      setResults(filteredResults);
      setIsOpen(filteredResults.length > 0);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Focus automatique avec ⌘ K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fermer le dropdown en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    // Navigation vers la page correspondante
    window.location.href = result.url;
    setIsOpen(false);
    setQuery('');
  };

  const getTypeColor = (type: string) => {
    const colors = {
      user: 'text-blue-500 bg-blue-500/10',
      tournament: 'text-yellow-500 bg-yellow-500/10',
      team: 'text-green-500 bg-green-500/10',
      league: 'text-purple-500 bg-purple-500/10',
      match: 'text-orange-500 bg-orange-500/10',
      badge: 'text-pink-500 bg-pink-500/10',
      document: 'text-indigo-500 bg-indigo-500/10',
      ticket: 'text-red-500 bg-red-500/10'
    };
    return colors[type as keyof typeof colors] || 'text-gray-500 bg-gray-500/10';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple/50 transition-all duration-200"
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--overlay-hover)] rounded"
          >
            <Command className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        )}
      </div>

      {/* Dropdown des résultats */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center text-[var(--text-secondary)]">
                <div className="animate-spin w-5 h-5 border-2 border-oxymore-purple border-t-transparent rounded-full mx-auto mb-2"></div>
                Recherche en cours...
              </div>
            ) : results.length > 0 ? (
              <>
                {/* Header avec nombre de résultats */}
                <div className="px-4 py-2 border-b border-[var(--border-color)] bg-[var(--background-secondary)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      ↑↓ pour naviguer • Entrée pour sélectionner • Échap pour fermer
                    </span>
                  </div>
                </div>

                {/* Liste des résultats */}
                <div className="max-h-80 overflow-y-auto">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 cursor-pointer transition-colors ${
                        index === selectedIndex
                          ? 'bg-oxymore-purple/10 border-l-4 border-oxymore-purple'
                          : 'hover:bg-[var(--overlay-hover)]'
                      }`}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(result.type)} flex-shrink-0`}>
                          {result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-[var(--text-primary)] truncate">
                              {result.title}
                            </h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(result.type)}`}>
                              {result.category}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer avec raccourcis */}
                <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--background-secondary)]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Recherche dans tous les éléments</span>
                    <div className="flex items-center gap-4">
                      <span>⌘K pour focus</span>
                      <span>⌘/ pour aide</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-[var(--text-secondary)]">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucun résultat trouvé pour "{query}"</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Essayez avec d'autres mots-clés
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
