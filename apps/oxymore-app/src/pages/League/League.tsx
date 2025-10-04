import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OXMButton, OXMDropdown } from '@oxymore/ui';
import './League.scss';

interface TeamMatch {
  opponent: string;
  result: 'W' | 'L' | 'D';
  score: string;
}

interface TeamStats {
  id: number;
  rank: number;
  teamName: string;
  teamLogo: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  winstreak: number;
  lastFiveMatches: TeamMatch[];
  gamesPlayed: number;
  winRate: number;
}

const League: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('2024');
  const [selectedLeague, setSelectedLeague] = useState('Premier Division');
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);

  const leagueOptions = [
    { label: 'Premier Division', value: 'Premier Division' },
    { label: 'Championship', value: 'Championship' },
    { label: 'Division 1', value: 'Division 1' },
    { label: 'Division 2', value: 'Division 2' }
  ];

  const seasonOptions = [
    { label: '2024 Season', value: '2024' },
    { label: '2023 Season', value: '2023' },
    { label: '2022 Season', value: '2022' }
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setTeams(generateMockTeams());
      setLoading(false);
    }, 1000);
  }, [selectedSeason, selectedLeague]);

  const generateMockTeams = (): TeamStats[] => {
    const teamNames = [
      'FireStrike', 'Thunder', 'Glacier Guard', 'Phoenix Rising', 'Shadow Wolves',
      'Crimson Titans', 'Neon Warriors', 'Arctic Storm', 'Golden Eagles', 'Void Hunters',
      'Solar Flare', 'Mystic Dragons', 'Iron Legion', 'Frost Giants', 'Blaze Runners',
      'Storm Breakers', 'Night Hawks', 'Crystal Knights', 'Wild Hunters', 'Prime Force'
    ];

    return teamNames.map((name, index) => ({
      id: index + 1,
      rank: index + 1,
      teamName: name,
      teamLogo: `/api/placeholder/40/40?text=${name.charAt(0)}`,
      wins: Math.floor(Math.random() * 20) + 5,
      losses: Math.floor(Math.random() * 15) + 1,
      draws: Math.floor(Math.random() * 5),
      points: Math.floor(Math.random() * 60) + 10,
      winstreak: Math.floor(Math.random() * 8),
      gamesPlayed: Math.floor(Math.random() * 30) + 10,
      winRate: Math.floor(Math.random() * 40) + 40,
      lastFiveMatches: Array.from({ length: 5 }, () => ({
        opponent: `Team ${Math.floor(Math.random() * 100)}`,
        result: ['W', 'L', 'D'][Math.floor(Math.random() * 3)] as 'W' | 'L' | 'D',
        score: `${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 5) + 1}`
      }))
    })).sort((a, b) => b.points - a.points);
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    if (rank <= 10) return '#8B5CF6'; // Purple
    return '#6B7280'; // Gray
  };

  const getMatchResultColor = (result: string) => {
    switch (result) {
      case 'W': return '#10B981'; // Green
      case 'L': return '#EF4444'; // Red
      case 'D': return '#F59E0B'; // Yellow
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div className="league-page">
        <div className="league-loading">
          <div className="loading-spinner"></div>
          <p>Loading league standings...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="league-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="league-container">
        {/* Header Section */}
        <motion.div
          className="league-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <div className="league-title-section">
            <motion.h1
              className="league-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            >
              League Standings
            </motion.h1>
            <motion.div
              className="league-selectors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
            >
              <OXMDropdown
                options={leagueOptions}
                value={selectedLeague}
                onChange={setSelectedLeague}
                theme="purple"
              />
              <OXMDropdown
                options={seasonOptions}
                value={selectedSeason}
                onChange={setSelectedSeason}
                theme="purple"
              />
            </motion.div>
          </div>

          <motion.div
            className="league-stats-overview"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
            >
              <span className="stat-number">{teams.length}</span>
              <span className="stat-label">Teams</span>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
            >
              <span className="stat-number">{teams.reduce((sum, team) => sum + team.gamesPlayed, 0)}</span>
              <span className="stat-label">Matches Played</span>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
            >
              <span className="stat-number">{Math.max(...teams.map(t => t.points))}</span>
              <span className="stat-label">Highest Points</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          className="league-leaderboard"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="leaderboard-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9, ease: "easeOut" }}
          >
            <div className="rank-column">Rank</div>
            <div className="team-column">Team</div>
            <div className="stats-column">W</div>
            <div className="stats-column">L</div>
            <div className="stats-column">D</div>
            <div className="stats-column">Pts</div>
            <div className="stats-column">WS</div>
            <div className="stats-column">WR%</div>
            <div className="matches-column">Last 5</div>
          </motion.div>

          <div className="leaderboard-body">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                className={`leaderboard-row ${index < 3 ? 'top-three' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.0 + (index * 0.02),
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="rank-cell">
                  <div
                    className="rank-badge"
                    style={{ backgroundColor: getRankBadgeColor(team.rank) }}
                  >
                    {team.rank}
                  </div>
                </div>

                <div className="team-cell">
                  <img src={team.teamLogo} alt={team.teamName} className="team-logo" />
                  <span className="team-name">{team.teamName}</span>
                </div>

                <div className="stats-cell wins">{team.wins}</div>
                <div className="stats-cell losses">{team.losses}</div>
                <div className="stats-cell draws">{team.draws}</div>
                <div className="stats-cell points">{team.points}</div>
                <div className="stats-cell winstreak">
                  <span className={`streak-indicator ${team.winstreak > 0 ? 'positive' : 'negative'}`}>
                    {team.winstreak > 0 ? `+${team.winstreak}` : team.winstreak}
                  </span>
                </div>
                <div className="stats-cell winrate">{team.winRate}%</div>

                <div className="matches-cell">
                  <div className="last-matches">
                    {team.lastFiveMatches.map((match, matchIndex) => (
                      <div
                        key={matchIndex}
                        className="match-result"
                        style={{ backgroundColor: getMatchResultColor(match.result) }}
                        title={`vs ${match.opponent} (${match.score})`}
                      >
                        {match.result}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default League;
