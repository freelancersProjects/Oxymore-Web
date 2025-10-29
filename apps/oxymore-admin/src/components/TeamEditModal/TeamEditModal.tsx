import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import type { TeamDetails } from '../../hooks/useTeamDetails';

interface TeamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<TeamDetails>) => Promise<void>;
  teamData: TeamDetails | null;
  isLoading?: boolean;
}

const TeamEditModal: React.FC<TeamEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teamData,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<TeamDetails>>({});

  useEffect(() => {
    if (teamData) {
      setFormData({
        team_name: teamData.team_name,
        description: teamData.description || '',
        max_members: teamData.max_members,
        entry_type: teamData.entry_type,
      });
    }
  }, [teamData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--card-background)] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--border-color)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                Edit Team
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.team_name || ''}
                  onChange={(e) => handleChange('team_name', e.target.value)}
                  required
                  className="input-base w-full"
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="input-base w-full resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Max Members */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Max Members
                </label>
                <input
                  type="number"
                  value={formData.max_members || ''}
                  onChange={(e) => handleChange('max_members', e.target.value ? parseInt(e.target.value) : null)}
                  min="1"
                  className="input-base w-full"
                  disabled={isLoading}
                />
              </div>

              {/* Entry Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Entry Type
                </label>
                <select
                  value={formData.entry_type || 'open'}
                  onChange={(e) => handleChange('entry_type', e.target.value)}
                  className="input-base w-full"
                  disabled={isLoading}
                >
                  <option value="open">Open</option>
                  <option value="inscription">Inscription</option>
                  <option value="cv">CV</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-[var(--border-color)]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[var(--overlay-hover)] rounded-lg text-[var(--text-primary)] font-medium hover:bg-[var(--overlay-active)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-oxymore-purple hover:bg-oxymore-purple-light rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamEditModal;

