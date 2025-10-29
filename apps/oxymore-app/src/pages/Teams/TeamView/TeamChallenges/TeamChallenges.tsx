import React, { useState } from "react";
import { Sword, Calendar, Check, X, Clock, Users, Trophy } from "lucide-react";
import { avatarService } from "../../../../services/avatarService";
import EmptyState from "../../../../components/EmptyState/EmptyState";
import type { Team } from "../../../../types/team";
import "./TeamChallenges.scss";

interface TeamChallengesProps {
  teamId: string;
  teamData: Team | null;
}

interface TeamChallenge {
  id_team_challenge: string;
  id_team_challenger: string;
  id_team_challenged: string;
  challenger_team_name: string;
  challenger_team_logo_url?: string;
  challenged_team_name: string;
  challenged_team_logo_url?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  scheduled_date?: string | null;
  created_at: string;
}

const TeamChallenges: React.FC<TeamChallengesProps> = ({ teamId, teamData }) => {
  const [challenges, setChallenges] = useState<TeamChallenge[]>([]);

  const mockChallenges: TeamChallenge[] = [
    {
      id_team_challenge: "1",
      id_team_challenger: "team-1",
      id_team_challenged: teamId || "current-team",
      challenger_team_name: "Les Dragons",
      challenger_team_logo_url: undefined,
      challenged_team_name: teamData?.name || "Votre équipe",
      challenged_team_logo_url: teamData?.logo,
      status: "pending",
      scheduled_date: null,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_team_challenge: "2",
      id_team_challenger: teamId || "current-team",
      id_team_challenged: "team-2",
      challenger_team_name: teamData?.name || "Votre équipe",
      challenger_team_logo_url: teamData?.logo,
      challenged_team_name: "Warriors Elite",
      challenged_team_logo_url: undefined,
      status: "accepted",
      scheduled_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_team_challenge: "3",
      id_team_challenger: "team-3",
      id_team_challenged: teamId || "current-team",
      challenger_team_name: "Shadow Squad",
      challenger_team_logo_url: undefined,
      challenged_team_name: teamData?.name || "Votre équipe",
      challenged_team_logo_url: teamData?.logo,
      status: "completed",
      scheduled_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const displayChallenges = challenges.length > 0 ? challenges : mockChallenges;

  const isIncomingChallenge = (challenge: TeamChallenge) => {
    return challenge.id_team_challenged === teamId;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente",
      accepted: "Accepté",
      rejected: "Refusé",
      completed: "Terminé",
      cancelled: "Annulé",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#fbbf24",
      accepted: "#10b981",
      rejected: "#ef4444",
      completed: "#6366f1",
      cancelled: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (displayChallenges.length === 0) {
    return (
      <div className="team-challenges-page">
        <div className="challenges-header">
          <h2 className="challenges-title">Défis</h2>
        </div>
        <EmptyState
          icon={Sword}
          title="Aucun défi"
          description="Aucun défi n'a été reçu ou envoyé pour le moment"
        />
      </div>
    );
  }

  const pendingChallenges = displayChallenges.filter((c) => c.status === "pending");
  const otherChallenges = displayChallenges.filter((c) => c.status !== "pending");

  return (
    <div className="team-challenges-page">
      <div className="challenges-header">
        <h2 className="challenges-title">Défis</h2>
        <div className="challenges-count">
          {displayChallenges.length} défi{displayChallenges.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="challenges-container">
        {pendingChallenges.length > 0 && (
          <div className="challenges-section">
            <h3 className="section-title">Défis en attente</h3>
            <div className="challenges-list">
              {pendingChallenges.map((challenge) => {
                const isIncoming = isIncomingChallenge(challenge);
                const opponentTeam = isIncoming
                  ? {
                      name: challenge.challenger_team_name,
                      logo: challenge.challenger_team_logo_url,
                    }
                  : {
                      name: challenge.challenged_team_name,
                      logo: challenge.challenged_team_logo_url,
                    };

                return (
                  <div key={challenge.id_team_challenge} className="challenge-row pending">
                    <div className="challenge-main">
                      <div className="challenge-teams">
                        <div className="challenge-team">
                          <img
                            src={avatarService.getAvatarUrl(
                              isIncoming ? teamData?.name : challenge.challenger_team_name,
                              isIncoming ? teamData?.logo : challenge.challenger_team_logo_url
                            )}
                            alt={isIncoming ? teamData?.name : challenge.challenger_team_name}
                            className="challenge-team-logo"
                          />
                          <span className="challenge-team-name">
                            {isIncoming ? teamData?.name : challenge.challenger_team_name}
                          </span>
                        </div>
                        <div className="challenge-vs">
                          <Sword size={16} />
                        </div>
                        <div className="challenge-team">
                          <img
                            src={avatarService.getAvatarUrl(
                              isIncoming ? opponentTeam.name : teamData?.name || "",
                              isIncoming ? opponentTeam.logo : teamData?.logo
                            )}
                            alt={isIncoming ? opponentTeam.name : teamData?.name}
                            className="challenge-team-logo"
                          />
                          <span className="challenge-team-name">
                            {isIncoming ? opponentTeam.name : teamData?.name}
                          </span>
                        </div>
                      </div>
                      <div className="challenge-info">
                        <span className="challenge-date">
                          <Calendar size={12} />
                          {formatDate(challenge.created_at)}
                        </span>
                        {isIncoming && (
                          <span className="challenge-direction">Défi reçu</span>
                        )}
                      </div>
                    </div>
                    <div className="challenge-actions">
                      {isIncoming && challenge.status === "pending" && (
                        <>
                          <button className="challenge-action-btn accept" title="Accepter le défi">
                            <Check size={18} />
                          </button>
                          <button className="challenge-action-btn reject" title="Refuser le défi">
                            <X size={18} />
                          </button>
                        </>
                      )}
                      {!isIncoming && challenge.status === "pending" && (
                        <button className="challenge-action-btn cancel" title="Annuler le défi">
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {otherChallenges.length > 0 && (
          <div className="challenges-section">
            <h3 className="section-title">Historique</h3>
            <div className="challenges-list">
              {otherChallenges.map((challenge) => {
                const isIncoming = isIncomingChallenge(challenge);
                const opponentTeam = isIncoming
                  ? {
                      name: challenge.challenger_team_name,
                      logo: challenge.challenger_team_logo_url,
                    }
                  : {
                      name: challenge.challenged_team_name,
                      logo: challenge.challenged_team_logo_url,
                    };

                return (
                  <div key={challenge.id_team_challenge} className="challenge-row">
                    <div className="challenge-main">
                      <div className="challenge-teams">
                        <div className="challenge-team">
                          <img
                            src={avatarService.getAvatarUrl(
                              isIncoming ? teamData?.name : challenge.challenger_team_name,
                              isIncoming ? teamData?.logo : challenge.challenger_team_logo_url
                            )}
                            alt={isIncoming ? teamData?.name : challenge.challenger_team_name}
                            className="challenge-team-logo"
                          />
                          <span className="challenge-team-name">
                            {isIncoming ? teamData?.name : challenge.challenger_team_name}
                          </span>
                        </div>
                        <div className="challenge-vs">
                          <Sword size={16} />
                        </div>
                        <div className="challenge-team">
                          <img
                            src={avatarService.getAvatarUrl(
                              isIncoming ? opponentTeam.name : teamData?.name || "",
                              isIncoming ? opponentTeam.logo : teamData?.logo
                            )}
                            alt={isIncoming ? opponentTeam.name : teamData?.name}
                            className="challenge-team-logo"
                          />
                          <span className="challenge-team-name">
                            {isIncoming ? opponentTeam.name : teamData?.name}
                          </span>
                        </div>
                      </div>
                      <div className="challenge-info">
                        <span className="challenge-date">
                          <Calendar size={12} />
                          {formatDate(challenge.created_at)}
                        </span>
                        {challenge.scheduled_date && (
                          <span className="challenge-scheduled">
                            <Clock size={12} />
                            {formatDate(challenge.scheduled_date)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className="challenge-status-badge"
                      style={{ borderColor: getStatusColor(challenge.status) }}
                    >
                      <span
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(challenge.status) }}
                      />
                      {getStatusLabel(challenge.status)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChallenges;

