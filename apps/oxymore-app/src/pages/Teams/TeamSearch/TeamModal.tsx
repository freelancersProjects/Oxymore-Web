import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Users,
  Trophy,
  TrendingUp,
  Target,
  Crown,
  MapPin,
  Calendar,
  Shield,
  Star,
  UserPlus,
  MessageCircle,
  Sword,
  Share2
} from 'lucide-react';
import { OXMChip } from '@oxymore/ui';
import type { Team } from './types';

interface TeamModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinTeam: () => void;
  onContactTeam: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({
  team,
  isOpen,
  onClose,
  onJoinTeam,
  onContactTeam
}) => {
  if (!team || !isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="team-modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="team-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-team-info">
            <div className="modal-logo">
              {team.logo ? (
                <img src={team.logo} alt={team.name} />
                    ) : (
                      <Shield />
                    )}
            </div>
            <div className="modal-title-section">
              <h1>{team.name}</h1>
              <p>{team.description}</p>
              <div className="modal-badges">
                {team.isVerified && (
                  <div className="badge verified">
                    <Shield />
                    <span>Vérifiée</span>
                  </div>
                )}
                {team.isPremium && (
                  <div className="badge premium">
                    <Star />
                    <span>Premium</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-stats">
            <div className="stat-card">
              <Users className="w-6 h-6" />
              <div className="stat-info">
                <span className="stat-number">{team.members}/{team.maxMembers}</span>
                <span className="stat-label">Membres</span>
              </div>
            </div>
            <div className="stat-card">
              <Trophy className="w-6 h-6" />
              <div className="stat-info">
                <span className="stat-number">{team.rating}</span>
                <span className="stat-label">Note</span>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp className="w-6 h-6" />
              <div className="stat-info">
                <span className="stat-number">{team.winRate}%</span>
                <span className="stat-label">Victoires</span>
              </div>
            </div>
            <div className="stat-card">
              <Target className="w-6 h-6" />
              <div className="stat-info">
                <span className="stat-number">{team.gamesPlayed}</span>
                <span className="stat-label">Parties</span>
              </div>
            </div>
          </div>

          <div className="modal-details">
            <div className="detail-section">
              <h3>Capitaine</h3>
              <div className="captain-info">
                <Crown className="w-5 h-5" />
                <span>{team.captain}</span>
              </div>
            </div>
            <div className="detail-section">
              <h3>Région</h3>
              <div className="region-info">
                <MapPin className="w-5 h-5" />
                <span>{team.region}</span>
              </div>
            </div>
            <div className="detail-section">
              <h3>Fondée le</h3>
              <div className="date-info">
                <Calendar className="w-5 h-5" />
                <span>{new Date(team.foundedDate).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          <div className="modal-tags">
            <h3>Jeux</h3>
            <div className="tags-grid">
              {team.tags.map(tag => (
                <OXMChip key={tag} variant="default" size="medium">
                  {tag}
                </OXMChip>
              ))}
            </div>
          </div>

          {team.requirements.length > 0 && (
            <div className="modal-requirements">
              <h3>Exigences</h3>
              <ul>
                {team.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="action-button primary" onClick={onJoinTeam}>
            <UserPlus className="w-5 h-5" />
            Rejoindre l'équipe
          </button>
          <button className="action-button secondary" onClick={onContactTeam}>
            <MessageCircle className="w-5 h-5" />
            Contacter
          </button>
          <button className="action-button secondary">
            <Sword className="w-5 h-5" />
            Défier
          </button>
          <button className="action-button secondary">
            <Share2 className="w-5 h-5" />
            Partager
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamModal;
