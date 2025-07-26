import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Trophy,
  Users,
  Star,
  Upload,
  Info,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockBadges = [
  { id: '1', name: 'Champion Trophy', icon: Trophy },
  { id: '2', name: 'Elite Badge', icon: Star },
  { id: '3', name: 'Victory Crown', icon: Trophy }
];

const CreateLeague = () => {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState('');
  const [showBadgeSelector, setShowBadgeSelector] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/leagues')}
          className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create League</h1>
          <p className="text-[var(--text-secondary)] mt-1">Set up a new competitive league</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  League Name
                </label>
                <input
                  type="text"
                  placeholder="Enter league name"
                  className="input-base w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the league..."
                  className="input-base w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  League Image
                </label>
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
                    <p className="text-[var(--text-secondary)]">
                      Drag and drop an image, or{' '}
                      <span className="text-oxymore-purple cursor-pointer">browse</span>
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Recommended: 800x400px, max 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Structure */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">League Structure</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Maximum Teams
                  </label>
                  <input
                    type="number"
                    min="2"
                    placeholder="Enter max teams"
                    className="input-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Entry Type
                  </label>
                  <select className="input-base w-full">
                    <option value="open">Open Entry</option>
                    <option value="invite">Invite Only</option>
                    <option value="qualifier">Qualifier Required</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Promotion Slots
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Number of teams promoted"
                    className="input-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Relegation Slots
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Number of teams relegated"
                    className="input-base w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Schedule</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  className="input-base w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Champion Badge */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Champion Badge</h2>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowBadgeSelector(!showBadgeSelector)}
                className="w-full p-4 bg-[var(--overlay-hover)] rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {selectedBadge ? (
                    <>
                      <Trophy className="w-5 h-5 text-[var(--text-primary)]" />
                      <span className="text-[var(--text-primary)]">
                        {mockBadges.find(b => b.id === selectedBadge)?.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-[var(--text-secondary)]">Select champion badge</span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${
                  showBadgeSelector ? 'rotate-180' : ''
                }`} />
              </button>

              {showBadgeSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl shadow-lg">
                  {mockBadges.map((badge) => (
                    <button
                      key={badge.id}
                      onClick={() => {
                        setSelectedBadge(badge.id);
                        setShowBadgeSelector(false);
                      }}
                      className="w-full p-3 flex items-center gap-3 hover:bg-[var(--overlay-hover)] transition-colors"
                    >
                      <badge.icon className="w-5 h-5 text-[var(--text-primary)]" />
                      <span className="text-[var(--text-primary)]">{badge.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tips</h2>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-[var(--text-secondary)]">
                • Set realistic team limits based on your expected participation
              </p>
              <p className="text-[var(--text-secondary)]">
                • Consider time zones when setting match schedules
              </p>
              <p className="text-[var(--text-secondary)]">
                • Balance promotion/relegation slots for league sustainability
              </p>
              <p className="text-[var(--text-secondary)]">
                • Choose an appropriate entry type for your target audience
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="card-base p-6">
            <div className="space-y-3">
              <button
                onClick={() => {/* Handle create */}}
                className="w-full py-2 px-4 bg-oxymore-purple text-white rounded-xl hover:bg-oxymore-purple-light transition-colors"
              >
                Create League
              </button>
              <button
                onClick={() => navigate('/leagues')}
                className="w-full py-2 px-4 button-secondary rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeague; 
 
 