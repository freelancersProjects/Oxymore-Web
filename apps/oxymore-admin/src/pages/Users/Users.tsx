import React, { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Users as UsersIcon,
  Search,
  Filter,
  Shield,
  Ban,
  Edit,
  Trash,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  History
} from 'lucide-react';
import { OXMCheckbox } from '@oxymore/ui';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12%',
      trend: 'up',
      color: 'bg-gradient-blue'
    },
    {
      title: 'Active Today',
      value: '1,249',
      change: '+5%',
      trend: 'up',
      color: 'bg-gradient-purple'
    },
    {
      title: 'New This Week',
      value: '348',
      change: '-2%',
      trend: 'down',
      color: 'bg-gradient-oxymore'
    }
  ];

  const users = [
    {
      id: '1',
      username: 'ProGamer_2023',
      email: 'progamer@email.com',
      status: 'active',
      role: 'user',
      matches: 156,
      winRate: '68%',
      joined: '2023-12-01',
      verified: true
    },
    {
      id: '2',
      username: 'Team_Alpha',
      email: 'alpha@team.com',
      status: 'active',
      role: 'team_owner',
      matches: 89,
      winRate: '72%',
      joined: '2023-11-15',
      verified: true
    },
    {
      id: '3',
      username: 'ElitePlayer',
      email: 'elite@player.com',
      status: 'banned',
      role: 'user',
      matches: 45,
      winRate: '55%',
      joined: '2023-12-10',
      verified: false
    },
    {
      id: '4',
      username: 'TournamentOrg',
      email: 'org@tournament.com',
      status: 'active',
      role: 'organizer',
      matches: 0,
      winRate: '-',
      joined: '2023-11-01',
      verified: true
    },
    {
      id: '5',
      username: 'CasualGamer',
      email: 'casual@gamer.com',
      status: 'inactive',
      role: 'user',
      matches: 12,
      winRate: '42%',
      joined: '2023-12-15',
      verified: false
    }
  ];

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedUsers(checked ? users.map(user => user.id) : []);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSelection = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      
      setSelectAll(newSelection.length === users.length);
      return newSelection;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400/10 text-green-400';
      case 'inactive':
        return 'bg-gray-400/10 text-gray-400';
      case 'banned':
        return 'bg-red-400/10 text-red-400';
      default:
        return 'bg-gray-400/10 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Users</h1>
        <p className="text-secondary mt-1">Manage and monitor user accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Users</p>
              <h3 className="stat-value">12,847</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Active Today</p>
              <h3 className="stat-value">1,249</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+5%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">New This Week</p>
              <h3 className="stat-value">348</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-down">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm font-medium">-2%</span>
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
              placeholder="Search users..."
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
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">User</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Role</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Matches</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Win Rate</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Joined</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b border-[var(--border-color)] hover:bg-[var(--overlay-hover)] cursor-pointer"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <td className="w-10 px-4 py-4" onClick={e => e.stopPropagation()}>
                    <OXMCheckbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      theme="purple"
                      className="scale-90"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-oxymore-purple/10 flex items-center justify-center text-oxymore-purple font-medium">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-primary font-medium">{user.username}</p>
                        <p className="text-muted text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'status-active' :
                      user.status === 'banned' ? 'status-banned' :
                      'status-inactive'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-secondary">{user.role}</td>
                  <td className="px-4 py-4 text-secondary">{user.matches}</td>
                  <td className="px-4 py-4 text-secondary">{user.winRate ? `${user.winRate}%` : '-'}</td>
                  <td className="px-4 py-4 text-secondary">{user.joined}</td>
                  <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover-overlay rounded-lg">
                        <Edit className="w-4 h-4 text-secondary" />
                      </button>
                      <button className="p-2 hover-overlay rounded-lg">
                        <History className="w-4 h-4 text-secondary" />
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

export default Users; 
 
 
 