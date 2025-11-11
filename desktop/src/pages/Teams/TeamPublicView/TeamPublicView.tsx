import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Users, Trophy, MapPin, Calendar, Shield, Star, UserPlus, Mail } from 'lucide-react';
import { OXMButton, OXMToast } from '@oxymore/ui';
import { teamService } from '../../../services/teamService';
import { notificationService } from '../../../services/notificationService';
import { DEFAULT_TEAM_LOGO, DEFAULT_TEAM_BANNER } from '../../../constants/teamDefaults';
import TeamCVModal from '../TeamSearch/TeamCVModal/TeamCVModal';
import TeamContactModal from '../TeamSearch/TeamContactModal/TeamContactModal';
import type { Team } from '../../../types/team';
import './TeamPublicView.scss';

const TeamPublicView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) {
        setError('ID d\'équipe manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const teamData = await teamService.getTeamById(id);
        setTeam(teamData);
      } catch (err: any) {
        console.error('Error fetching team:', err);
        setError(err?.response?.data?.message || 'Erreur lors du chargement de l\'équipe');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: team?.name,
        text: `Découvrez cette équipe: ${team?.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  const handleJoinTeam = async () => {
    if (!team) return;

    const userStr = localStorage.getItem('useroxm');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      setToast({ message: 'Vous devez être connecté pour rejoindre une équipe', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      if (team.entryType === 'open') {
        await teamService.joinTeam(team.id, user.id_user);
        setIsLoading(false);
        setToast({ message: 'Vous avez rejoint l\'équipe avec succès!', type: 'success' });
        setTimeout(() => {
          navigate(`/teams/${team.id}`);
        }, 1500);
      } else if (team.entryType === 'inscription') {
        await teamService.sendTeamApplication(team.id, user.id_user);
        setIsLoading(false);
        setToast({ message: 'Demande envoyée avec succès!', type: 'success' });
        setTimeout(() => {
          navigate('/teams');
        }, 1500);
      } else if (team.entryType === 'cv') {
        setIsLoading(false);
        setShowCVModal(true);
      }
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Une erreur est survenue',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  const handleCVSubmit = async (subject: string, message: string) => {
    if (!team) return;
    
    const userStr = localStorage.getItem('useroxm');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    try {
      await teamService.sendTeamCV(team.id, user.id_user, subject, message);
      
      try {
        const members = await teamService.getTeamMembersByTeamId(team.id);
        const admins = members.filter((m: any) => m.role === 'captain' || m.role === 'admin');
        const username = user.username || user.first_name || 'Un utilisateur';
        
        for (const admin of admins) {
          await notificationService.createForUser(
            `${username} a postulé pour rejoindre ${team.name}`,
            'message',
            admin.id_user,
            'Nouvelle candidature reçue'
          );
        }
      } catch (notifError) {
      }
      
      setShowCVModal(false);
      setToast({ message: 'Candidature envoyée avec succès!', type: 'success' });
      setTimeout(() => {
        navigate('/teams');
      }, 1500);
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Une erreur est survenue',
        type: 'error'
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="team-public-view-container">
        <div className="team-public-view-loading">Chargement de l'équipe...</div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="team-public-view-container">
        <div className="team-public-view-error">{error || 'Équipe non trouvée'}</div>
      </div>
    );
  }

  return (
    <div className="team-public-view-container">
      <div className="team-public-view-banner">
        <div
          className="team-public-view-banner-background"
          style={{
            backgroundImage: team.banner
              ? `url(${team.banner})`
              : `url(${DEFAULT_TEAM_BANNER})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="banner-overlay"></div>
        </div>
        <div className="team-public-view-banner-content">
          <div className="team-public-view-banner-main">
            <img
              src={team.logo || DEFAULT_TEAM_LOGO}
              alt={team.name}
              className="team-public-view-logo"
            />
            <div className="team-public-view-banner-info">
              <h1 className="team-public-view-title">{team.name}</h1>
              <div className="team-public-view-badges">
                {team.isVerified && (
                  <div className="badge verified">
                    <Shield size={18} />
                    <span>Vérifiée</span>
                  </div>
                )}
                {team.isPremium && (
                  <div className="badge premium">
                    <Star size={18} />
                    <span>Premium</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="team-public-view-banner-actions">
            <OXMButton 
              variant="primary" 
              size="large" 
              onClick={handleJoinTeam}
              disabled={isLoading}
            >
              {isLoading ? (
                <>Chargement...</>
              ) : (
                <>
                  <UserPlus size={18} />
                  Rejoindre l'équipe
                </>
              )}
            </OXMButton>
            <button className="team-public-view-share-btn" onClick={handleShare}>
              <Share2 size={20} />
            </button>
            {team.id_captain && (
              <button 
                className="team-public-view-contact-btn" 
                onClick={() => setShowContactModal(true)}
                title="Contacter"
              >
                <Mail size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="team-public-view-content">
        <div className="team-public-view-main">
          <div className="team-public-view-section">
            <h2 className="team-public-view-section-title">À propos</h2>
            <p className="team-public-view-description">{team.description}</p>
          </div>

          <div className="team-public-view-section">
            <h2 className="team-public-view-section-title">Informations</h2>
            <div className="team-public-view-info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <Users size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Capitaine</span>
                  <span className="info-value">{team.captain}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <Shield size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Type d'entrée</span>
                  <span className="info-value">
                    {team.entryType === 'open' ? 'Ouverte' : 
                     team.entryType === 'inscription' ? 'Sur inscription' : 'Sur CV'}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <UserPlus size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Recrutement</span>
                  <div style={{ marginTop: '4px' }}>
                    {team.isRecruiting ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.375rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 500,
                        fontFamily: 'Outfit, sans-serif',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}>
                        On recrute
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.375rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 500,
                        fontFamily: 'Outfit, sans-serif',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}>
                        On ne recrute pas
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Région</span>
                  <span className="info-value">{team.region}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <Calendar size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Fondée le</span>
                  <span className="info-value">{new Date(team.foundedDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>

          {team.requirements && team.requirements.length > 0 && (
            <div className="team-public-view-section">
              <h2 className="team-public-view-section-title">Exigences</h2>
              <ul className="requirements-list">
                {team.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="team-public-view-sidebar">
          <div className="stats-card">
            <div className="stat-item-large">
              <div className="stat-icon-large">
                <Users size={32} />
              </div>
              <div className="stat-content-large">
                <span className="stat-value-large">{team.members}/{team.maxMembers}</span>
                <span className="stat-label-large">Membres</span>
              </div>
            </div>
            <div className="stat-item-large">
              <div className="stat-icon-large">
                <Trophy size={32} />
              </div>
              <div className="stat-content-large">
                <span className="stat-value-large">{team.winRate}%</span>
                <span className="stat-label-large">Victoires</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {team && (
        <>
          <TeamCVModal
            isOpen={showCVModal}
            onClose={() => setShowCVModal(false)}
            onSubmit={handleCVSubmit}
            teamName={team.name}
          />

          {team.id_captain && (
            <TeamContactModal
              isOpen={showContactModal}
              onClose={() => setShowContactModal(false)}
              teamName={team.name}
              captainId={team.id_captain}
            />
          )}
        </>
      )}

      {toast && (
        <OXMToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default TeamPublicView;

