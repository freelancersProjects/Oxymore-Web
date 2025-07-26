import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Trophy, Users, Calendar,
  DollarSign, Edit, Trash, Eye, Plus,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { OXMCheckbox } from '@oxymore/ui';

const tournaments = [
  {
    id: '1',
    name: 'CS2 Summer Championship',
    organizer: 'Oxymore Esports',
    type: 'csgo',
    status: 'active',
    participants: 128,
    prize: 50000,
    start_date: '2024-01-15',
    is_premium: true
  },
  {
    id: '2',
    name: 'Valorant Pro League',
    organizer: 'Pro Gaming League',
    type: 'valorant',
    status: 'upcoming',
    participants: 64,
    prize: 25000,
    start_date: '2024-02-01',
    is_premium: true
  },
  {
    id: '3',
    name: 'League of Legends Cup',
    organizer: 'ESL Gaming',
    type: 'lol',
    status: 'completed',
    participants: 32,
    prize: 15000,
    start_date: '2023-12-15',
    is_premium: false
  }
];

const Tournaments = () => {
  const navigate = useNavigate();
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedTournaments(checked ? tournaments.map(t => t.id) : []);
  };

  const toggleTournamentSelection = (id: string) => {
    setSelectedTournaments(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id];
      setSelectAll(newSelection.length === tournaments.length);
      return newSelection;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tournaments</h1>
          <p className="text-secondary mt-1">Manage and monitor tournaments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/tournaments/create')}
          className="button-primary px-6 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Tournament</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Active Tournaments</p>
              <h3 className="stat-value">24</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+8%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Prize Pool</p>
              <h3 className="stat-value">$90,000</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+15%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Participants</p>
              <h3 className="stat-value">1,847</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-down">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm font-medium">-3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="card-base p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search tournaments..."
              className="input-base w-full pl-10"
            />
          </div>
          <button className="button-secondary px-4 py-2 rounded-xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="w-10 px-4 py-4">
                  <OXMCheckbox
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    theme="purple"
                    className="scale-90"
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Tournament</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Participants</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Prize Pool</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Start Date</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament) => (
                <tr key={tournament.id} className="border-b border-[var(--border-color)] hover:bg-[var(--overlay-hover)]">
                  <td className="w-10 px-4 py-4">
                    <OXMCheckbox
                      checked={selectedTournaments.includes(tournament.id)}
                      onChange={() => toggleTournamentSelection(tournament.id)}
                      theme="purple"
                      className="scale-90"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-oxymore-purple/10 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-oxymore-purple" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-primary font-medium">{tournament.name}</p>
                          {tournament.is_premium && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-oxymore-purple/10 text-oxymore-purple rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-muted text-sm">{tournament.organizer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tournament.status === 'active' ? 'status-active' :
                      tournament.status === 'completed' ? 'status-inactive' :
                      'text-blue-400 bg-blue-400/10 border border-blue-400/20'
                    }`}>
                      {tournament.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-secondary" />
                      <span className="text-secondary">{tournament.participants}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-secondary" />
                      <span className="text-secondary">${tournament.prize.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span className="text-secondary">{tournament.start_date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover-overlay rounded-lg">
                        <Eye className="w-4 h-4 text-secondary" />
                      </button>
                      <button className="p-2 hover-overlay rounded-lg">
                        <Edit className="w-4 h-4 text-secondary" />
                      </button>
                      <button className="p-2 hover-overlay rounded-lg">
                        <Trash className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tournaments; 
 
 