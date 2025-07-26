import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Star,
  Trophy,
  Medal,
  Shield,
  Target,
  Crown,
  Info
} from 'lucide-react';

const iconOptions = [
  { name: 'Trophy', icon: Trophy },
  { name: 'Star', icon: Star },
  { name: 'Medal', icon: Medal },
  { name: 'Shield', icon: Shield },
  { name: 'Target', icon: Target },
  { name: 'Crown', icon: Crown }
];

const colorOptions = [
  { name: 'Gold', class: 'from-yellow-500 to-amber-600' },
  { name: 'Purple', class: 'from-purple-500 to-indigo-600' },
  { name: 'Blue', class: 'from-blue-500 to-cyan-600' },
  { name: 'Red', class: 'from-red-500 to-rose-600' },
  { name: 'Green', class: 'from-emerald-500 to-green-600' }
];

const CreateBadge = () => {
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showColorSelector, setShowColorSelector] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/badges')}
          className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Badge</h1>
          <p className="text-[var(--text-secondary)] mt-1">Create a new achievement badge</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Badge Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Badge Name
                </label>
                <input
                  type="text"
                  placeholder="Enter badge name"
                  className="input-base w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe how to earn this badge..."
                  className="input-base w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Unlock Condition
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify the conditions to unlock this badge..."
                  className="input-base w-full resize-none"
                />
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Example: "Win 10 matches" or "Reach 1000 kills"
                </p>
              </div>
            </div>
          </div>

          {/* Badge Design */}
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Badge Design</h2>
            
            <div className="space-y-6">
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Badge Icon
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon.name}
                      onClick={() => setSelectedIcon(icon)}
                      className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                        selectedIcon.name === icon.name
                          ? 'bg-gradient-to-br from-oxymore-purple to-oxymore-purple-light text-white scale-110 shadow-lg'
                          : 'bg-[var(--overlay-hover)] text-[var(--text-primary)] hover:bg-[var(--overlay-active)]'
                      }`}
                    >
                      <icon.icon className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Badge Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`aspect-square rounded-xl bg-gradient-to-br ${color.class} ${
                        selectedColor.name === color.name
                          ? 'scale-110 ring-2 ring-white/50'
                          : 'hover:scale-105'
                      } transition-all shadow-lg`}
                    />
                  ))}
                </div>
              </div>

              {/* Badge Preview */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4">
                  Preview
                </label>
                <div className="flex items-center justify-center p-8 bg-[var(--overlay-hover)] rounded-xl">
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${selectedColor.class} flex items-center justify-center shadow-lg`}>
                    <selectedIcon.icon className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Custom Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Custom Image (Optional)
                </label>
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
                    <p className="text-[var(--text-secondary)]">
                      Drag and drop an image, or{' '}
                      <span className="text-oxymore-purple cursor-pointer">browse</span>
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      PNG or SVG, max 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tips</h2>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-[var(--text-secondary)]">
                • Keep badge names short and memorable
              </p>
              <p className="text-[var(--text-secondary)]">
                • Make unlock conditions clear and achievable
              </p>
              <p className="text-[var(--text-secondary)]">
                • Use descriptive icons that match the achievement
              </p>
              <p className="text-[var(--text-secondary)]">
                • Consider using custom images for special badges
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
                Create Badge
              </button>
              <button
                onClick={() => navigate('/badges')}
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

export default CreateBadge; 
 
 