import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Shield,
  Monitor,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Users,
  Settings,
  Ban,
  Crown,
  Star,
  GitBranch,
  LayoutGrid
} from 'lucide-react';

interface Team {
  name: string;
  score: number;
}

interface BracketMatch {
  id: string;
  team1: Team;
  team2: Team;
  status: 'live' | 'upcoming' | 'completed';
  date: string;
}

interface Round {
  name: string;
  matches: BracketMatch[];
}

interface BracketMatchProps {
  match: BracketMatch;
  isCurrentMatch?: boolean;
}

interface BracketProps {
  rounds: Round[];
  currentMatchId: string;
}

const mockMatch = {
  id: '1',
  tournament: {
    id: '1',
    name: 'Oxymore Major 2024',
    type: 'tournament',
    stage: 'Quarter Finals',
    bracket: {
      rounds: [
        {
          name: 'Quarter Finals',
          matches: [
            {
              id: '1',
              team1: { name: 'Team Liquid', score: 1 },
              team2: { name: 'Fnatic', score: 0 },
              status: 'live',
              date: '2024-02-20T15:00:00'
            },
            {
              id: '2',
              team1: { name: 'NAVI', score: 0 },
              team2: { name: 'Vitality', score: 0 },
              status: 'upcoming',
              date: '2024-02-20T18:00:00'
            },
            {
              id: '3',
              team1: { name: 'FaZe', score: 2 },
              team2: { name: 'G2', score: 1 },
              status: 'completed',
              date: '2024-02-20T12:00:00'
            },
            {
              id: '4',
              team1: { name: 'Cloud9', score: 0 },
              team2: { name: 'NiP', score: 2 },
              status: 'completed',
              date: '2024-02-20T09:00:00'
            }
          ]
        },
        {
          name: 'Semi Finals',
          matches: [
            {
              id: '5',
              team1: { name: 'TBD', score: 0 },
              team2: { name: 'TBD', score: 0 },
              status: 'upcoming',
              date: '2024-02-21T15:00:00'
            },
            {
              id: '6',
              team1: { name: 'TBD', score: 0 },
              team2: { name: 'TBD', score: 0 },
              status: 'upcoming',
              date: '2024-02-21T18:00:00'
            }
          ]
        },
        {
          name: 'Finals',
          matches: [
            {
              id: '7',
              team1: { name: 'TBD', score: 0 },
              team2: { name: 'TBD', score: 0 },
              status: 'upcoming',
              date: '2024-02-22T18:00:00'
            }
          ]
        }
      ]
    }
  },
  team1: {
    id: '1',
    name: 'Team Liquid',
    logo: null,
    score: 1,
    players: [
      { name: 'Player1', kills: 24, deaths: 18, assists: 5 },
      { name: 'Player2', kills: 20, deaths: 15, assists: 8 },
      { name: 'Player3', kills: 18, deaths: 20, assists: 4 },
      { name: 'Player4', kills: 16, deaths: 19, assists: 6 },
      { name: 'Player5', kills: 15, deaths: 21, assists: 3 }
    ]
  },
  team2: {
    id: '2',
    name: 'Fnatic',
    logo: null,
    score: 0,
    players: [
      { name: 'Player6', kills: 22, deaths: 17, assists: 4 },
      { name: 'Player7', kills: 19, deaths: 16, assists: 7 },
      { name: 'Player8', kills: 17, deaths: 19, assists: 5 },
      { name: 'Player9', kills: 15, deaths: 20, assists: 4 },
      { name: 'Player10', kills: 14, deaths: 22, assists: 2 }
    ]
  },
  status: 'live',
  is_streamed: true,
  match_date: '2024-02-20T15:00:00',
  maps: [
    { 
      name: 'Inferno',
      status: 'completed',
      winner: 'Team Liquid',
      score: '16-14',
      stats: {
        team1: { rounds_won: 16, rounds_lost: 14, t_rounds: 9, ct_rounds: 7 },
        team2: { rounds_won: 14, rounds_lost: 16, t_rounds: 6, ct_rounds: 8 }
      }
    },
    { 
      name: 'Mirage',
      status: 'live',
      score: '12-10',
      stats: {
        team1: { rounds_won: 12, rounds_lost: 10, t_rounds: 8, ct_rounds: 4 },
        team2: { rounds_won: 10, rounds_lost: 12, t_rounds: 4, ct_rounds: 6 }
      }
    },
    { name: 'Ancient', status: 'upcoming' }
  ],
  room: {
    id: '1',
    name: 'Room #1',
    status: 'active',
    chat: [
      { id: '1', user: 'Admin', message: 'Match is starting in 5 minutes', time: '15:55' },
      { id: '2', user: 'Team Liquid', message: 'We are ready', time: '15:56' },
      { id: '3', user: 'Fnatic', message: 'Ready here too', time: '15:57' },
      { id: '4', user: 'Admin', message: 'Good luck!', time: '16:00' }
    ]
  }
};

const BracketMatch: React.FC<BracketMatchProps> = ({ match, isCurrentMatch = false }) => (
  <div
    className={`p-4 rounded-xl border transition-all ${
      isCurrentMatch
        ? 'border-oxymore-purple bg-oxymore-purple/5'
        : 'border-[var(--border-color)] bg-[var(--overlay-hover)] hover:border-oxymore-purple/50'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {match.team1.name}
      </span>
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {match.team1.score}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {match.team2.name}
      </span>
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {match.team2.score}
      </span>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
      <span className="text-xs text-[var(--text-secondary)]">
        {new Date(match.date).toLocaleTimeString()}
      </span>
      <span className={`ml-auto text-xs font-medium ${
        match.status === 'live' 
          ? 'text-green-500' 
          : match.status === 'completed' 
          ? 'text-[var(--text-secondary)]'
          : 'text-blue-500'
      }`}>
        {match.status.toUpperCase()}
      </span>
    </div>
  </div>
);

const TreeBracket: React.FC<BracketProps> = ({ rounds, currentMatchId }) => (
  <div className="relative p-8">
    <div className="flex items-center justify-between mb-8">
      {rounds.map((round) => (
        <h4 key={round.name} className="text-[var(--text-primary)] font-medium text-center min-w-[300px]">
          {round.name}
        </h4>
      ))}
    </div>

    <div className="flex justify-between relative">
      {/* Lignes de connexion */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {/* Lignes pour Quarter Finals -> Semi Finals */}
        <line x1="35%" y1="15%" x2="50%" y2="15%" className="stroke-[var(--border-color)] stroke-2" />
        <line x1="35%" y1="85%" x2="50%" y2="85%" className="stroke-[var(--border-color)] stroke-2" />
        <line x1="50%" y1="15%" x2="50%" y2="85%" className="stroke-[var(--border-color)] stroke-2" />
        <line x1="50%" y1="50%" x2="65%" y2="50%" className="stroke-[var(--border-color)] stroke-2" />

        {/* Lignes pour Semi Finals -> Finals */}
        <line x1="65%" y1="35%" x2="80%" y2="35%" className="stroke-[var(--border-color)] stroke-2" />
        <line x1="65%" y1="65%" x2="80%" y2="65%" className="stroke-[var(--border-color)] stroke-2" />
        <line x1="80%" y1="35%" x2="80%" y2="65%" className="stroke-[var(--border-color)] stroke-2" />
        <line x1="80%" y1="50%" x2="95%" y2="50%" className="stroke-[var(--border-color)] stroke-2" />
      </svg>

      {/* Rounds */}
      <div className="flex justify-between w-full">
        {/* Quarter Finals */}
        <div className="flex flex-col justify-around min-w-[300px] space-y-4 relative z-10">
          {rounds[0].matches.map((match) => (
            <div
              key={match.id}
              className={`p-4 rounded-xl border transition-all ${
                match.id === currentMatchId
                  ? 'border-oxymore-purple bg-[var(--card-background)]'
                  : 'border-[var(--border-color)] bg-[var(--card-background)]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)]">{match.team1.name}</span>
                  <span className="font-medium text-[var(--text-primary)]">{match.team1.score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)]">{match.team2.name}</span>
                  <span className="font-medium text-[var(--text-primary)]">{match.team2.score}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-sm text-[var(--text-secondary)]">
                    {match.date.split('T')[1].substring(0, 5)}
                  </span>
                  <span className={`ml-auto text-sm font-medium ${
                    match.status === 'live' 
                      ? 'text-green-500' 
                      : match.status === 'completed' 
                      ? 'text-[var(--text-secondary)]'
                      : 'text-blue-500'
                  }`}>
                    {match.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Semi Finals */}
        <div className="flex flex-col justify-around min-w-[300px] py-[100px] relative z-10">
          {rounds[1].matches.map((match) => (
            <div
              key={match.id}
              className={`p-4 rounded-xl border transition-all ${
                match.id === currentMatchId
                  ? 'border-oxymore-purple bg-[var(--card-background)]'
                  : 'border-[var(--border-color)] bg-[var(--card-background)]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)]">{match.team1.name}</span>
                  <span className="font-medium text-[var(--text-primary)]">{match.team1.score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)]">{match.team2.name}</span>
                  <span className="font-medium text-[var(--text-primary)]">{match.team2.score}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-sm text-[var(--text-secondary)]">
                    {match.date.split('T')[1].substring(0, 5)}
                  </span>
                  <span className={`ml-auto text-sm font-medium ${
                    match.status === 'live' 
                      ? 'text-green-500' 
                      : match.status === 'completed' 
                      ? 'text-[var(--text-secondary)]'
                      : 'text-blue-500'
                  }`}>
                    {match.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Finals */}
        <div className="flex flex-col justify-center min-w-[300px] relative z-10">
          {rounds[2].matches.map((match) => (
            <div
              key={match.id}
              className={`p-4 rounded-xl border transition-all ${
                match.id === currentMatchId
                  ? 'border-oxymore-purple bg-[var(--card-background)]'
                  : 'border-[var(--border-color)] bg-[var(--card-background)]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)]">{match.team1.name}</span>
                  <span className="font-medium text-[var(--text-primary)]">{match.team1.score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)]">{match.team2.name}</span>
                  <span className="font-medium text-[var(--text-primary)]">{match.team2.score}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-sm text-[var(--text-secondary)]">
                    {match.date.split('T')[1].substring(0, 5)}
                  </span>
                  <span className={`ml-auto text-sm font-medium ${
                    match.status === 'live' 
                      ? 'text-green-500' 
                      : match.status === 'completed' 
                      ? 'text-[var(--text-secondary)]'
                      : 'text-blue-500'
                  }`}>
                    {match.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CardBracket: React.FC<BracketProps> = ({ rounds, currentMatchId }) => (
  <div className="space-y-6">
    {rounds.map((round) => (
      <div key={round.name}>
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-oxymore-purple" />
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">{round.name}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {round.matches.map((match) => (
            <BracketMatch
              key={match.id}
              match={match}
              isCurrentMatch={match.id === currentMatchId}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [bracketView, setBracketView] = useState('tree'); // 'tree' ou 'cards'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/matches')}
          className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Match Details</h1>
          <p className="text-[var(--text-secondary)] mt-1">View and manage match information</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Match Card */}
          <div className="card-base p-6">
            {/* Tournament Info */}
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-oxymore-purple" />
              <span className="text-[var(--text-primary)] font-medium">{mockMatch.tournament.name}</span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[var(--text-secondary)]">{mockMatch.tournament.stage}</span>
              {mockMatch.is_streamed && (
                <>
                  <span className="text-[var(--text-muted)]">•</span>
                  <div className="flex items-center gap-1">
                    <Monitor className="w-4 h-4 text-purple-500" />
                    <span className="text-purple-500 text-sm">Live Stream</span>
                  </div>
                </>
              )}
            </div>

            {/* Teams Score */}
            <div className="grid grid-cols-7 gap-4 items-center mb-8">
              {/* Team 1 */}
              <div className="col-span-3">
                <div className="flex items-center gap-4 justify-end">
                  <div className="text-right">
                    <p className="text-xl font-bold text-[var(--text-primary)]">{mockMatch.team1.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">Rank #1</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-oxymore flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="col-span-1">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">{mockMatch.team1.score}</span>
                  <span className="text-[var(--text-muted)] text-2xl">:</span>
                  <span className="text-4xl font-bold text-[var(--text-primary)]">{mockMatch.team2.score}</span>
                </div>
              </div>

              {/* Team 2 */}
              <div className="col-span-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-oxymore flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">{mockMatch.team2.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">Rank #2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Maps</h3>
              {mockMatch.maps.map((map, index) => (
                <div
                  key={index}
                  className="p-4 bg-[var(--overlay-hover)] rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[var(--text-secondary)]" />
                      <span className="font-medium text-[var(--text-primary)]">{map.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        map.status === 'live'
                          ? 'bg-green-500/10 text-green-500'
                          : map.status === 'completed'
                          ? 'bg-[var(--overlay-hover)] text-[var(--text-secondary)]'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {map.status.toUpperCase()}
                      </span>
                    </div>
                    {map.score && (
                      <span className="text-lg font-bold text-[var(--text-primary)]">{map.score}</span>
                    )}
                  </div>

                  {map.stats && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[var(--text-secondary)]">T Side</span>
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {map.stats.team1.t_rounds} rounds
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)]">CT Side</span>
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {map.stats.team1.ct_rounds} rounds
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[var(--text-secondary)]">T Side</span>
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {map.stats.team2.t_rounds} rounds
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)]">CT Side</span>
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {map.stats.team2.ct_rounds} rounds
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tournament Bracket */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Tournament Bracket</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBracketView('tree')}
                  className={`p-2 rounded-xl transition-colors ${
                    bracketView === 'tree'
                      ? 'bg-oxymore-purple text-white'
                      : 'bg-[var(--overlay-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <GitBranch className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setBracketView('cards')}
                  className={`p-2 rounded-xl transition-colors ${
                    bracketView === 'cards'
                      ? 'bg-oxymore-purple text-white'
                      : 'bg-[var(--overlay-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>

            {bracketView === 'tree' ? (
              <TreeBracket
                rounds={mockMatch.tournament.bracket.rounds}
                currentMatchId={mockMatch.id}
              />
            ) : (
              <CardBracket
                rounds={mockMatch.tournament.bracket.rounds}
                currentMatchId={mockMatch.id}
              />
            )}
          </div>

          {/* Player Stats */}
          <div className="card-base p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Player Statistics</h3>
            <div className="space-y-6">
              {/* Team 1 Players */}
              <div>
                <h4 className="text-[var(--text-primary)] font-medium mb-4">{mockMatch.team1.name}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border-color)]">
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">Player</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">K</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">D</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">A</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">K/D</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockMatch.team1.players.map((player, index) => (
                        <tr key={index} className="border-b border-[var(--border-color)]">
                          <td className="px-4 py-2 text-[var(--text-primary)]">{player.name}</td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">{player.kills}</td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">{player.deaths}</td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">{player.assists}</td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">
                            {(player.kills / Math.max(player.deaths, 1)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team 2 Players */}
              <div>
                <h4 className="text-[var(--text-primary)] font-medium mb-4">{mockMatch.team2.name}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border-color)]">
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">Player</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">K</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">D</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">A</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-secondary)]">K/D</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockMatch.team2.players.map((player, index) => (
                        <tr key={index} className="border-b border-[var(--border-color)]">
                          <td className="px-4 py-2 text-[var(--text-primary)]">{player.name}</td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">{player.kills}</td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">{player.deaths}</td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">{player.assists}</td>
                          <td className="px-4 py-2 text-[var(--text-primary)]">
                            {(player.kills / Math.max(player.deaths, 1)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[350px] flex-shrink-0 space-y-6">
          {/* Match Info */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Match Info</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  mockMatch.status === 'live' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                } mt-1`}>
                  {mockMatch.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Start Time</p>
                <p className="text-[var(--text-primary)] mt-1">
                  {new Date(mockMatch.match_date).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Room</p>
                <p className="text-[var(--text-primary)] mt-1">{mockMatch.room.name}</p>
              </div>
            </div>
          </div>

          {/* Match Chat */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Match Chat</h2>
            </div>

            <div className="space-y-4 mb-6">
              {mockMatch.room.chat.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-oxymore flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">{message.user[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[var(--text-primary)]">{message.user}</p>
                      <span className="text-xs text-[var(--text-muted)]">{message.time}</span>
                    </div>
                    <p className="text-[var(--text-secondary)]">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="input-base w-full pr-12"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-oxymore-purple hover:text-oxymore-purple-light transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Actions</h2>
            </div>

            <div className="space-y-3">
              <button className="button-secondary w-full py-2 rounded-xl flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Edit Match</span>
              </button>
              <button className="w-full py-2 rounded-xl flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                <Ban className="w-4 h-4" />
                <span>Cancel Match</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails; 