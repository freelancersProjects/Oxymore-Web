import React, { useState, useEffect } from "react";
import { Check, X, Calendar, Mail, FileText, Eye } from "lucide-react";
import { teamService } from "../../../../services/teamService";
import { notificationService } from "../../../../services/notificationService";
import { avatarService } from "../../../../services/avatarService";
import { OXMToast, OXMLoader, OXMModal } from "@oxymore/ui";
import EmptyState from "../../../../components/EmptyState/EmptyState";
import type { Team, TeamApplication } from "../../../../types/team";
import "./TeamApplications.scss";

interface TeamApplicationsProps {
  teamId: string;
  teamData: Team | null;
  onApplicationStatusChange?: () => void;
}

const TeamApplications: React.FC<TeamApplicationsProps> = ({ teamId, teamData, onApplicationStatusChange }) => {
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedCV, setSelectedCV] = useState<TeamApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, [teamId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeamApplications(teamId);
      setApplications(data);
    } catch (error) {
      setToast({ message: "Erreur lors du chargement des candidatures", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      setProcessingId(applicationId);

      const application = applications.find(app => app.id_team_application === applicationId);

      await teamService.updateApplicationStatus(applicationId, status);

      if (status === 'accepted' && application) {
        try {
          await teamService.joinTeam(teamId, application.id_user);
          
          const teamName = teamData?.name || 'l\'équipe';
          await notificationService.createForUser(
            `Votre candidature pour rejoindre ${teamName} a été acceptée !`,
            'success',
            application.id_user,
            'Candidature acceptée'
          );
          
          setToast({ message: "Candidature acceptée et membre ajouté à l'équipe", type: "success" });
        } catch (joinError) {
          setToast({ message: "Candidature acceptée mais erreur lors de l'ajout du membre", type: "error" });
        }
      } else if (status === 'rejected' && application) {
        const teamName = teamData?.name || 'l\'équipe';
        await notificationService.createForUser(
          `Votre candidature pour rejoindre ${teamName} a été refusée.`,
          'alert',
          application.id_user,
          'Candidature refusée'
        );
        
        setToast({ message: "Candidature refusée", type: "success" });
      }

      await loadApplications();
      if (onApplicationStatusChange) {
        onApplicationStatusChange();
      }
    } catch (error) {
      setToast({ message: "Erreur lors de la mise à jour", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const otherApplications = applications.filter(app => app.status !== 'pending');

  const isCVApplication = (application: TeamApplication): boolean => {
    return !!application.subject || !!application.message;
  };

  const getAvatarUrl = (application: TeamApplication) => {
    return avatarService.getAvatarUrl(application.username, application.avatar_url);
  };

  if (loading) {
    return (
      <div className="team-applications-page">
        <OXMLoader type="normal" text="Chargement des candidatures..." />
      </div>
    );
  }

  return (
    <div className="team-applications-page">
      <div className="applications-header">
        <h2 className="applications-title">Candidatures</h2>
        {pendingApplications.length > 0 && (
          <span className="applications-count">{pendingApplications.length} en attente</span>
        )}
      </div>

      {toast && (
        <OXMToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucune candidature"
          description="Aucune demande d'inscription n'a été reçue pour le moment"
        />
      ) : (
        <div className="applications-container">
          {pendingApplications.length > 0 && (
            <div className="applications-section">
              <h3 className="section-title">En attente ({pendingApplications.length})</h3>
              <div className="applications-list">
                {pendingApplications.map((application) => (
                  <div key={application.id_team_application} className="application-row pending">
                    <div className="application-main">
                      <img
                        src={getAvatarUrl(application)}
                        alt={application.username}
                        className="application-avatar"
                      />
                      <div className="application-user-info">
                        <span className="application-username">{application.username || 'Utilisateur inconnu'}</span>
                        {application.created_at && (
                          <span className="application-date">
                            <Calendar size={12} />
                            {new Date(application.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                        {application.subject && (
                          <div className="application-subject-line">
                            <Mail size={12} />
                            <strong>{application.subject}</strong>
                          </div>
                        )}
                        {application.message && (
                          <div
                            className={`application-message-preview ${isCVApplication(application) ? 'clickable' : ''}`}
                            title={isCVApplication(application) ? "Cliquer pour voir le CV complet" : application.message}
                            onClick={() => isCVApplication(application) && setSelectedCV(application)}
                          >
                            {application.message.substring(0, 60)}...
                            {isCVApplication(application) && (
                              <Eye size={12} className="view-cv-icon" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="application-status-badge pending">En attente</span>
                    <div className="application-actions">
                      <button
                        className="action-btn accept"
                        onClick={() => handleStatusChange(application.id_team_application, 'accepted')}
                        disabled={processingId === application.id_team_application}
                        title="Accepter la candidature"
                      >
                        <Check size={16} />
                        {processingId === application.id_team_application ? '...' : 'Accepter'}
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => handleStatusChange(application.id_team_application, 'rejected')}
                        disabled={processingId === application.id_team_application}
                        title="Refuser la candidature"
                      >
                        <X size={16} />
                        {processingId === application.id_team_application ? '...' : 'Refuser'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherApplications.length > 0 && (
            <div className="applications-section">
              <h3 className="section-title">Historique</h3>
              <div className="applications-list">
                {otherApplications.map((application) => (
                  <div key={application.id_team_application} className="application-row">
                    <div className="application-main">
                      <img
                        src={getAvatarUrl(application)}
                        alt={application.username}
                        className="application-avatar"
                      />
                      <div className="application-user-info">
                        <span className="application-username">{application.username || 'Utilisateur inconnu'}</span>
                        {application.created_at && (
                          <span className="application-date">
                            <Calendar size={12} />
                            {new Date(application.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                        {application.subject && (
                          <div className="application-subject-line">
                            <Mail size={12} />
                            <strong>{application.subject}</strong>
                          </div>
                        )}
                        {application.message && (
                          <div
                            className={`application-message-preview ${isCVApplication(application) ? 'clickable' : ''}`}
                            title={isCVApplication(application) ? "Cliquer pour voir le CV complet" : application.message}
                            onClick={() => isCVApplication(application) && setSelectedCV(application)}
                          >
                            {application.message.substring(0, 60)}...
                            {isCVApplication(application) && (
                              <Eye size={12} className="view-cv-icon" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`application-status-badge ${application.status}`}>
                      {application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedCV && (
        <OXMModal
          isOpen={!!selectedCV}
          onClose={() => setSelectedCV(null)}
          variant="large"
        >
          <div className="cv-view-modal">
            <div className="cv-modal-header">
              <div className="cv-header-content">
                <img
                  src={getAvatarUrl(selectedCV)}
                  alt={selectedCV.username}
                  className="cv-user-avatar"
                />
                <div className="cv-user-info">
                  <h3 className="cv-username">{selectedCV.username || 'Utilisateur inconnu'}</h3>
                  {selectedCV.created_at && (
                    <span className="cv-date">
                      <Calendar size={14} />
                      {new Date(selectedCV.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
              <button className="cv-close-btn" onClick={() => setSelectedCV(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="cv-modal-content">
              {selectedCV.subject && (
                <div className="cv-subject-section">
                  <div className="cv-section-label">
                    <Mail size={16} />
                    <span>Sujet</span>
                  </div>
                  <p className="cv-subject">{selectedCV.subject}</p>
                </div>
              )}

              {selectedCV.message && (
                <div className="cv-message-section">
                  <div className="cv-section-label">
                    <FileText size={16} />
                    <span>Message</span>
                  </div>
                  <div className="cv-message-content">
                    <p>{selectedCV.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </OXMModal>
      )}
    </div>
  );
};

export default TeamApplications;
