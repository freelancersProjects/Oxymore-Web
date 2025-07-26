import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, Trophy, Shield, Target, Crown } from 'lucide-react';

const mockBadges = [
  {
    id: '1',
    name: 'Tournament Winner',
    description: 'Won a major tournament',
    icon: Trophy,
    color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    textColor: 'text-yellow-500',
    count: 156
  },
  {
    id: '2',
    name: 'Team Captain',
    description: 'Led a team to victory',
    icon: Crown,
    color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    textColor: 'text-purple-500',
    count: 89
  },
  {
    id: '3',
    name: 'Sharpshooter',
    description: 'Achieved exceptional accuracy',
    icon: Target,
    color: 'bg-gradient-to-br from-red-500 to-rose-600',
    textColor: 'text-red-500',
    count: 234
  },
  {
    id: '4',
    name: 'Team Spirit',
    description: 'Outstanding team contribution',
    icon: Shield,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    textColor: 'text-blue-500',
    count: 412
  },
  {
    id: '5',
    name: 'MVP',
    description: 'Most Valuable Player',
    icon: Star,
    color: 'bg-gradient-to-br from-emerald-500 to-green-600',
    textColor: 'text-emerald-500',
    count: 67
  }
];

const Badges = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Badges</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage and create achievement badges</p>
        </div>
        <button
          onClick={() => navigate('/badges/create')}
          className="button-primary px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Badge</span>
        </button>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBadges.map((badge) => (
          <div
            key={badge.id}
            className="group relative bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl p-6 hover:border-oxymore-purple transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${badge.color} flex items-center justify-center`}>
                <badge.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{badge.name}</h3>
                <p className="text-[var(--text-secondary)] mt-1">{badge.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="px-3 py-1 rounded-lg bg-[var(--overlay-hover)] text-[var(--text-secondary)]">
                    <span className="text-sm">{badge.count} users</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Overlay */}
            <div className="absolute inset-0 bg-[var(--card-background)]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
              <button className="px-4 py-2 bg-oxymore-purple text-white rounded-xl hover:bg-oxymore-purple-light transition-colors">
                Edit Badge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges; 
 
 