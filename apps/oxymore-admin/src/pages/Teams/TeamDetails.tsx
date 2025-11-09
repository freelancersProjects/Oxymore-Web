import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Star,
  Users,
  Crown,
  MessageSquare,
  Settings,
  Ban,
  Clock,
  DollarSign,
  Send,
  Loader2
} from 'lucide-react';
import { useTeamDetails } from '../../hooks/useTeamDetails';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import TeamEditModal from '../../components/TeamEditModal/TeamEditModal';
import { apiService } from '../../api/apiService';
import type { TeamDetails } from '../../hooks/useTeamDetails';

const TeamDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { teamDetails, loading, error, refetch } = useTeamDetails(id);
  const [newMessage, setNewMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Helper function to format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-oxymore-purple" />
          <p className="text-[var(--text-secondary)]">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error || !teamDetails) {
    return (
      <div className="space-y-4 md:space-y-6">
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
            <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Team Details</h1>
          </div>
        </div>
        <div className="card-base p-6 text-center">
          <p className="text-red-400">{error || 'Team not found'}</p>
          <button
            onClick={() => navigate('/teams')}
            className="button-primary mt-4"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  const captain = teamDetails.members.find(m => m.role === 'captain' || m.id_user === teamDetails.id_captain);

  const handleEditTeam = async (data: Partial<TeamDetails>) => {
    if (!id) return;

    try {
      setIsSaving(true);
      await apiService.patch(`/teams/${id}`, data);
      await refetch();
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error('Error updating team:', err);
      alert(err.response?.data?.message || 'Failed to update team');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      await apiService.delete(`/teams/${id}`);
      navigate('/teams');
    } catch (err: any) {
      console.error('Error deleting team:', err);
      alert(err.response?.data?.message || 'Failed to delete team');
      setIsDeleting(false);
    }
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newMessage.trim()) return;

    try {
      setIsSendingMessage(true);
      await apiService.post('/team-chats/admin', {
        message: newMessage,
        id_team: id
      });
      setNewMessage('');
      await refetch();
    } catch (err: any) {
      console.error('Error sending admin message:', err);
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await apiService.delete(`/team-chats/${messageId}`);
      await refetch();
    } catch (err: any) {
      console.error('Error deleting message:', err);
      alert(err.response?.data?.message || 'Failed to delete message');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
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
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Team Details</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm md:text-base">View and manage team information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Team Info Card */}
          <div className="card-base p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-oxymore flex items-center justify-center overflow-hidden">
                  {teamDetails.team_logo_url ? (
                    <img src={teamDetails.team_logo_url} alt={teamDetails.team_name} className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] truncate">{teamDetails.team_name}</h2>
                    {teamDetails.subscription_status && (
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" />
                    )}
                    {teamDetails.verified && (
                      <Crown className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[var(--text-secondary)] mt-1 text-sm md:text-base">{teamDetails.description || 'No description'}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors self-start"
              >
                <Settings className="w-5 h-5 text-[var(--text-secondary)]" />
              </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
              <div className="p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl">
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">Members</p>
                <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mt-1">{teamDetails.members.length}</p>
              </div>
              <div className="p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl">
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">Max Members</p>
                <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mt-1">{teamDetails.max_members || '∞'}</p>
              </div>
              <div className="p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl">
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">Messages</p>
                <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mt-1">{teamDetails.chats.length}</p>
              </div>
              <div className="p-3 md:p-4 bg-[var(--overlay-hover)] rounded-xl">
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">Created</p>
                <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mt-1 text-sm md:text-base">{formatDate(teamDetails.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Team Chat */}
          <div className="card-base p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-oxymore-purple" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Team Chat</h2>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-[400px] overflow-y-auto">
              {teamDetails.chats.length === 0 ? (
                <p className="text-[var(--text-secondary)] text-center py-4">No messages yet</p>
              ) : (
                teamDetails.chats.map((chat) => {
                  const isAdmin = chat.is_admin || false;
                  return (
                    <div key={chat.id_team_chat} className="flex items-start gap-3 group hover:bg-[var(--overlay-hover)] p-2 rounded-lg transition-colors relative">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-red-500' : 'bg-gradient-oxymore'}`}>
                        {isAdmin ? (
                          <span className="text-white font-medium text-sm">Ad</span>
                        ) : chat.avatar_url ? (
                          <img src={chat.avatar_url} alt={chat.username || 'User'} className="w-full h-full rounded-lg object-cover" />
                        ) : (
                          <span className="text-white font-medium text-sm">{(chat.username || 'U')[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm md:text-base ${isAdmin ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                            {isAdmin ? 'Admin' : (chat.username || 'Unknown')}
                          </p>
                          <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(chat.sent_at)}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteMessage(chat.id_team_chat)}
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded text-red-400"
                            title="Delete message"
                          >
                            <Ban className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <p className={`text-sm md:text-base ${isAdmin ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>{chat.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendAdminMessage} className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message as admin..."
                className="input-base w-full pr-12 text-sm md:text-base"
                disabled={isSendingMessage}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSendingMessage || !newMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-oxymore-purple hover:text-oxymore-purple-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingMessage ? (
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Subscription Info */}
          <div className="card-base p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <DollarSign className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Subscription</h2>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  teamDetails.subscription_status ? 'status-active' : 'status-inactive'
                }`}>
                  {teamDetails.subscription_status ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">Entry Type</p>
                <p className="text-[var(--text-primary)] mt-1 text-sm md:text-base capitalize">{teamDetails.entry_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">Captain</p>
                <p className="text-[var(--text-primary)] mt-1 text-sm md:text-base">{teamDetails.captain_name || captain?.username || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-xs md:text-sm">Created At</p>
                <p className="text-[var(--text-primary)] mt-1 text-sm md:text-base">{formatDate(teamDetails.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="card-base p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-oxymore-purple" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Members</h2>
              </div>
              <span className="text-[var(--text-secondary)] text-xs md:text-sm">{teamDetails.members.length} members</span>
            </div>

            <div className="space-y-3 md:space-y-4 max-h-[400px] overflow-y-auto">
              {teamDetails.members.length === 0 ? (
                <p className="text-[var(--text-secondary)] text-center py-4">No members</p>
              ) : (
                teamDetails.members.map((member) => (
                  <div key={member.id_team_member} className="flex items-center justify-between p-3 hover:bg-[var(--overlay-hover)] rounded-xl transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-gradient-oxymore flex items-center justify-center flex-shrink-0">
                        {member.avatar_url ? (
                          <img src={member.avatar_url} alt={member.username || member.name || 'Member'} className="w-full h-full rounded-lg object-cover" />
                        ) : (
                          <span className="text-white font-medium text-sm">{(member.username || member.name || 'U')[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--text-primary)] text-sm md:text-base truncate">{member.username || member.name || 'Unknown'}</p>
                        <div className="flex items-center gap-2">
                          {member.role === 'captain' ? (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          ) : member.role === 'admin' ? (
                            <Shield className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                          )}
                          <span className="text-xs text-[var(--text-secondary)] capitalize">{member.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-xs md:text-sm text-[var(--text-secondary)]">{formatDate(member.join_date)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card-base p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Settings className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Actions</h2>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditModalOpen(true)}
                className="button-secondary w-full py-2 rounded-xl flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Team</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full py-2 rounded-xl flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm md:text-base"
              >
                <Ban className="w-4 h-4" />
                <span>Delete Team</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TeamEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditTeam}
        teamData={teamDetails}
        isLoading={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTeam}
        title="Delete Team"
        message={`Are you sure you want to delete "${teamDetails.team_name}"? This action cannot be undone and will permanently remove the team and all associated data.`}
        confirmText="Delete Team"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TeamDetails;

