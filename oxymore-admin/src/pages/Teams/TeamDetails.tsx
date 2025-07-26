import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Star,
  Users,
  Crown,
  Calendar,
  MessageSquare,
  Settings,
  Ban,
  Clock,
  DollarSign,
  ChevronRight,
  Send
} from 'lucide-react';

const mockTeam = {
  id: '1',
  name: 'Team Liquid',
  logo_url: null,
  banner_url: null,
  description: 'Professional esports organization competing in major tournaments worldwide.',
  members: [
    { id: '1', username: 'John Doe', role: 'captain', avatar: null, joined: '2023-11-01' },
    { id: '2', username: 'Alice Smith', role: 'member', avatar: null, joined: '2023-11-05' },
    { id: '3', username: 'Bob Wilson', role: 'member', avatar: null, joined: '2023-11-10' }
  ],
  subscription: {
    status: 'active',
    start_date: '2023-11-01',
    end_date: '2024-11-01',
    purchased_by: 'John Doe'
  },
  chat: [
    { id: '1', user: 'John Doe', message: 'Team practice at 8PM tonight!', time: '2 hours ago' },
    { id: '2', user: 'Alice Smith', message: `I'll be there!`, time: '1 hour ago' },
    { id: '3', user: 'Bob Wilson', message: 'Same here, see you all!', time: '30 minutes ago' }
  ],
  stats: {
    total_matches: 156,
    win_rate: 68,
    total_tournaments: 24,
    tournament_wins: 8
  }
};

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/teams')}
          className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team Details</h1>
          <p className="text-[var(--text-secondary)] mt-1">View and manage team information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Info Card */}
          <div className="card-base p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-oxymore flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{mockTeam.name}</h2>
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-[var(--text-secondary)] mt-1">{mockTeam.description}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5 text-[var(--text-secondary)]" />
              </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 bg-[var(--overlay-hover)] rounded-xl">
                <p className="text-[var(--text-secondary)] text-sm">Total Matches</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{mockTeam.stats.total_matches}</p>
              </div>
              <div className="p-4 bg-[var(--overlay-hover)] rounded-xl">
                <p className="text-[var(--text-secondary)] text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{mockTeam.stats.win_rate}%</p>
              </div>
              <div className="p-4 bg-[var(--overlay-hover)] rounded-xl">
                <p className="text-[var(--text-secondary)] text-sm">Tournaments</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{mockTeam.stats.total_tournaments}</p>
              </div>
              <div className="p-4 bg-[var(--overlay-hover)] rounded-xl">
                <p className="text-[var(--text-secondary)] text-sm">Tournament Wins</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{mockTeam.stats.tournament_wins}</p>
              </div>
            </div>
          </div>

          {/* Team Chat */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-oxymore-purple" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Team Chat</h2>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {mockTeam.chat.map((message) => (
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Subscription</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium status-active mt-1">
                  {mockTeam.subscription.status}
                </span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Start Date</p>
                <p className="text-[var(--text-primary)] mt-1">{mockTeam.subscription.start_date}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">End Date</p>
                <p className="text-[var(--text-primary)] mt-1">{mockTeam.subscription.end_date}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Purchased By</p>
                <p className="text-[var(--text-primary)] mt-1">{mockTeam.subscription.purchased_by}</p>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-oxymore-purple" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Members</h2>
              </div>
              <span className="text-[var(--text-secondary)] text-sm">{mockTeam.members.length} members</span>
            </div>

            <div className="space-y-4">
              {mockTeam.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 hover:bg-[var(--overlay-hover)] rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-oxymore flex items-center justify-center">
                      <span className="text-white font-medium">{member.username[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{member.username}</p>
                      <div className="flex items-center gap-2">
                        {member.role === 'captain' ? (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                        )}
                        <span className="text-xs text-[var(--text-secondary)]">{member.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{member.joined}</span>
                  </div>
                </div>
              ))}
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
                <span>Edit Team</span>
              </button>
              <button className="w-full py-2 rounded-xl flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                <Ban className="w-4 h-4" />
                <span>Suspend Team</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails; 
 
 