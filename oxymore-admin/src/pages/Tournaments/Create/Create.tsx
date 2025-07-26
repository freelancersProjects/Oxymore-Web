import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Trophy,
  Users,
  Calendar,
  MapPin,
  Info,
  Star,
  DollarSign,
  Shield
} from 'lucide-react';

const mockMaps = [
  'Inferno',
  'Mirage',
  'Nuke',
  'Overpass',
  'Ancient',
  'Vertigo',
  'Anubis'
];

const CreateTournament = () => {
  const navigate = useNavigate();
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);

  const toggleMap = (map: string) => {
    if (selectedMaps.includes(map)) {
      setSelectedMaps(selectedMaps.filter(m => m !== map));
    } else {
      setSelectedMaps([...selectedMaps, map]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/tournaments')}
          className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Tournament</h1>
          <p className="text-[var(--text-secondary)] mt-1">Set up a new tournament</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Tournament Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  placeholder="Enter tournament name"
                  className="input-base w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the tournament..."
                  className="input-base w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    className="input-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    className="input-base w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Tournament Banner
                </label>
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
                    <p className="text-[var(--text-secondary)]">
                      Drag and drop an image, or{' '}
                      <span className="text-oxymore-purple cursor-pointer">browse</span>
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Recommended: 1920x1080px, max 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Structure */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Tournament Structure</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Format
                  </label>
                  <select className="input-base w-full">
                    <option value="single_elimination">Single Elimination</option>
                    <option value="double_elimination">Double Elimination</option>
                    <option value="round_robin">Round Robin</option>
                    <option value="swiss">Swiss System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Team Size
                  </label>
                  <select className="input-base w-full">
                    <option value="5">5v5</option>
                    <option value="2">2v2</option>
                    <option value="1">1v1</option>
                  </select>
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Prize Pool
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter prize pool amount"
                    className="input-base w-full pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Maps */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Map Pool</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {mockMaps.map((map) => (
                <button
                  key={map}
                  onClick={() => toggleMap(map)}
                  className={`p-4 rounded-xl flex items-center justify-center transition-all ${
                    selectedMaps.includes(map)
                      ? 'bg-oxymore-purple text-white'
                      : 'bg-[var(--overlay-hover)] text-[var(--text-primary)] hover:bg-[var(--overlay-active)]'
                  }`}
                >
                  <span className="font-medium">{map}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tournament Status */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tournament Status</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Registration</span>
                <select className="input-base">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="soon">Coming Soon</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Visibility</span>
                <select className="input-base">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Featured</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-[var(--overlay-hover)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-oxymore-purple/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-oxymore-purple"></div>
                </label>
              </div>
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
                • Choose a format that suits your tournament size
              </p>
              <p className="text-[var(--text-secondary)]">
                • Set realistic registration deadlines
              </p>
              <p className="text-[var(--text-secondary)]">
                • Consider time zones when scheduling matches
              </p>
              <p className="text-[var(--text-secondary)]">
                • Select maps that are well-balanced and popular
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
                Create Tournament
              </button>
              <button
                onClick={() => navigate('/tournaments')}
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

export default CreateTournament; 
 
 