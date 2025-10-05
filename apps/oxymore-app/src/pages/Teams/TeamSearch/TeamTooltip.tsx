import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, TrendingUp, Shield } from 'lucide-react';
import { OXMChip } from "@oxymore/ui";
import type { Team } from './types';

interface TeamTooltipProps {
  team: Team | null;
  mousePosition?: { x: number; y: number };
}

const TeamTooltip: React.FC<TeamTooltipProps> = ({ team, mousePosition }) => {
  if (!team) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="team-tooltip"
      style={{
        position: 'fixed',
        top: mousePosition ? mousePosition.y - 10 : '50%',
        left: mousePosition ? mousePosition.x + 10 : '50%',
        transform: mousePosition ? 'translateY(-100%)' : 'translate(-50%, -50%)',
        zIndex: 10000,
        pointerEvents: 'none'
      }}
    >
      <div className="tooltip-content">
        <div className="tooltip-header">
          <div className="tooltip-logo">
            {team.logo ? (
              <img src={team.logo} alt={team.name} />
            ) : (
              <Shield className="w-8 h-8" />
            )}
          </div>
          <div className="tooltip-info">
            <h3>{team.name}</h3>
            <p>{team.description}</p>
          </div>
        </div>
        <div className="tooltip-stats">
          <div className="stat">
            <Users className="w-4 h-4" />
            <span>{team.members}/{team.maxMembers}</span>
          </div>
          <div className="stat">
            <Trophy className="w-4 h-4" />
            <span>{team.rating}</span>
          </div>
          <div className="stat">
            <TrendingUp className="w-4 h-4" />
            <span>{team.winRate}%</span>
          </div>
        </div>
        <div className="tooltip-tags">
          {team.tags.slice(0, 3).map(tag => (
            <OXMChip key={tag} variant="default" size="small">
              {tag}
            </OXMChip>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamTooltip;
