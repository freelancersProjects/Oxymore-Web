import React, { useState, useEffect } from "react";
import { Crown, UserX, Shield, Users, ChevronDown, Info, X } from "lucide-react";
import { teamService } from "../../../../services/teamService";
import { notificationService } from "../../../../services/notificationService";
import { OXMToast, OXMTooltip, OXMModal } from "@oxymore/ui";
import type { Team, TeamMemberDetailed, TeamMemberResponse } from "../../../../types/team";
import "./TeamMembers.scss";

interface TeamMembersProps {
  teamId: string;
  teamData: Team | null;
}

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

const generateAvatarWithInitial = (username: string, size: number = 48) => {
  const initial = username.charAt(0).toUpperCase();
  const colorIndex = username.charCodeAt(0) % AVATAR_COLORS.length;
  const backgroundColor = AVATAR_COLORS[colorIndex];

  return (
    <div
      className="avatar-initial"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        fontFamily: 'Orbitron, sans-serif'
      }}
    >
      {initial}
    </div>
  );
};

const Avatar: React.FC<{
  src?: string;
  username: string;
  size?: number;
  className?: string;
}> = ({ src, username, size = 48, className = "" }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={className}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    );
  }

  return generateAvatarWithInitial(username, size);
};

const TeamMembers: React.FC<TeamMembersProps> = ({ teamId, teamData }) => {
  const [members, setMembers] = useState<TeamMemberDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [updatingRoleMemberId, setUpdatingRoleMemberId] = useState<string | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [showAdminConfirmModal, setShowAdminConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; username: string } | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ memberId: string; newRole: string; memberUsername: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("useroxm");
    const user = userStr ? JSON.parse(userStr) : null;
    if (user) {
      setCurrentUserId(user.id_user);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.role-dropdown-wrapper')) {
        setOpenRoleDropdown(null);
      }
    };
    if (openRoleDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openRoleDropdown]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        const membersData = await teamService.getTeamMembersByTeamId(teamId);
        const detailedMembers: TeamMemberDetailed[] = membersData.map((member: TeamMemberResponse) => ({
          id_user: member.id_user,
          username: member.username || "Unknown",
          name: member.name,
          avatar: member.avatar_url,
          role: member.role,
          id_team_member: member.id_team_member,
          join_date: member.join_date,
        }));
        setMembers(detailedMembers);
      } catch (error) {
        setToast({ message: "Erreur lors du chargement des membres", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      loadMembers();
    }
  }, [teamId]);

  const currentUserMember = members.find(m => m.id_user === currentUserId);
  const captainMember = members.find(m => m.role === 'captain');

  const isTeamCreator = teamData?.id_captain === currentUserId;
  const isTeamOwner = isTeamCreator || captainMember?.id_user === currentUserId;
  const isAdmin = currentUserMember?.role === 'captain' || currentUserMember?.role === 'admin';

  const handleRemoveMemberClick = (memberId: string, memberUsername: string) => {
    setMemberToDelete({ id: memberId, username: memberUsername });
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      setDeletingMemberId(memberToDelete.id);
      const member = members.find(m => m.id_user === memberToDelete.id);
      if (member?.id_team_member) {
        await teamService.removeTeamMember(member.id_team_member);
        setMembers(members.filter(m => m.id_user !== memberToDelete.id));
        
        const teamName = teamData?.name || 'l\'équipe';
        await notificationService.createForUser(
          `Vous avez été retiré de ${teamName}.`,
          'alert',
          member.id_user,
          'Vous avez été exclu de l\'équipe'
        );
        
        setToast({ message: `${memberToDelete.username} a été retiré de l'équipe`, type: "success" });
      }
      setShowDeleteConfirmModal(false);
      setMemberToDelete(null);
    } catch (error) {
      setToast({ message: "Erreur lors de la suppression du membre", type: "error" });
    } finally {
      setDeletingMemberId(null);
    }
  };

  const handleRoleChangeClick = (memberId: string, newRole: string, memberUsername: string) => {
    if (newRole === 'admin') {
      setPendingRoleChange({ memberId, newRole, memberUsername });
      setShowAdminConfirmModal(true);
      setOpenRoleDropdown(null);
    } else {
      handleChangeRole(memberId, newRole, memberUsername);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string, memberUsername: string) => {
    try {
      setUpdatingRoleMemberId(memberId);
      const member = members.find(m => m.id_user === memberId);
      if (member?.id_team_member && member?.id_user) {
        const oldRole = member.role || 'member';
        
        await teamService.updateTeamMemberRole(member.id_team_member, newRole);
        
        setMembers(members.map(m =>
          m.id_user === memberId ? { ...m, role: newRole } : m
        ));
        
        if (oldRole !== newRole && member.id_user) {
          try {
            const teamName = teamData?.name || 'l\'équipe';
            const roleLabels: Record<string, string> = {
              captain: 'Capitaine',
              admin: 'Administrateur',
              member: 'Membre'
            };
            
            await notificationService.createForUser(
              `Votre rôle dans ${teamName} a été changé en ${roleLabels[newRole] || newRole}.`,
              'message',
              member.id_user,
              'Changement de rôle'
            );
            
            console.log('Notification created successfully');
          } catch (notifError) {
            console.error('Error creating notification for role change:', notifError);
            setToast({ 
              message: "Rôle mis à jour mais erreur lors de l'envoi de la notification", 
              type: "error" 
            });
          }
        } else {
          console.log('Role did not change or missing userId:', { oldRole, newRole, userId: member.id_user });
        }
        
        setToast({
          message: `Le rôle de ${memberUsername} a été mis à jour en ${getRoleLabel(newRole)}`,
          type: "success"
        });
      } else {
        console.error('Member not found or missing required fields:', { memberId, member });
      }
    } catch (error) {
      console.error('Error updating team member role:', error);
      setToast({ message: "Erreur lors de la mise à jour du rôle", type: "error" });
    } finally {
      setUpdatingRoleMemberId(null);
      setOpenRoleDropdown(null);
    }
  };

  const handleConfirmAdminRole = async () => {
    if (pendingRoleChange) {
      await handleChangeRole(
        pendingRoleChange.memberId,
        pendingRoleChange.newRole,
        pendingRoleChange.memberUsername
      );
      setShowAdminConfirmModal(false);
      setPendingRoleChange(null);
    }
  };

  const roleOptions = [
    {
      value: 'member',
      label: 'Membre',
      icon: <Users size={16} />,
      description: 'Membre standard de l\'équipe avec accès aux fonctionnalités de base'
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: <Shield size={16} />,
      description: 'Tous les droits : paramètres, candidatures, historique des tournois, gestion des membres'
    },
    {
      value: 'captain',
      label: 'Capitaine',
      icon: <Crown size={16} />,
      description: 'Propriétaire de l\'équipe. Peut inscrire l\'équipe aux tournois avec certains membres. Tous les droits d\'admin.'
    },
  ];

  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case 'captain':
        return 'Capitaine';
      case 'admin':
        return 'Admin';
      default:
        return 'Membre';
    }
  };

  const getRoleIcon = (role: string | undefined) => {
    switch (role) {
      case 'captain':
        return <Crown size={16} className="role-icon captain" />;
      case 'admin':
        return <Shield size={16} className="role-icon admin" />;
      default:
        return <Users size={16} className="role-icon member" />;
    }
  };

  if (loading) {
    return (
      <div className="team-members-page">
        <div className="loading-container">
          <p>Chargement des membres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="team-members-page">
      {toast && (
        <OXMToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="members-header">
        <div className="header-info">
          <h2 className="members-title">Membres de l'équipe</h2>
          <p className="members-count">{members.length} {members.length > 1 ? 'membres' : 'membre'}</p>
        </div>
        {teamData && (
          <div className="team-info-badge">
            <span className="max-members orbitron">{members.length} / {teamData.maxMembers}</span>
          </div>
        )}
      </div>

      {members.length === 0 ? (
        <div className="empty-state">
          <Users size={48} className="empty-icon" />
          <p>Aucun membre dans l'équipe</p>
        </div>
      ) : (
        <div className="members-list">
          {[...members].sort((a, b) => {
            if (a.id_user === currentUserId) return -1;
            if (b.id_user === currentUserId) return 1;
            return 0;
          }).map((member) => {
            const isTargetMember = member.role === 'member';
            const isCurrentUserAdmin = currentUserMember?.role === 'admin';

            const canRemove =
              member.id_user !== currentUserId &&
              (
                isTeamOwner ||
                (isCurrentUserAdmin && isTargetMember)
              );

            const canChangeRole = isTeamCreator && member.id_user !== currentUserId;
            const isCurrentUser = member.id_user === currentUserId;
            const isDropdownOpen = openRoleDropdown === member.id_user;

            return (
              <div key={member.id_user} className={`member-row ${isCurrentUser ? 'current-user' : ''} ${isDropdownOpen ? 'dropdown-open' : ''}`}>
                <div className="member-avatar-wrapper">
                  <Avatar
                    src={member.avatar}
                    username={member.username}
                    size={48}
                    className="member-avatar"
                  />
                  {member.role === 'captain' && (
                    <div className="role-badge captain">
                      <Crown size={12} />
                    </div>
                  )}
                  {member.role === 'admin' && (
                    <div className="role-badge admin">
                      <Shield size={12} />
                    </div>
                  )}
                </div>

                <div className="member-info">
                  <h3 className="member-username">{member.username}</h3>
                  {member.join_date && (
                    <p className="member-join-date">
                      Rejoint le {new Date(member.join_date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                <div className="member-actions">
                  {canChangeRole && (
                    <div className="role-dropdown-wrapper">
                      <button
                        className="role-select-btn"
                        onClick={() => setOpenRoleDropdown(isDropdownOpen ? null : member.id_user)}
                        disabled={updatingRoleMemberId === member.id_user}
                      >
                        <div className="role-select-content">
                          {getRoleIcon(member.role)}
                          <span>{getRoleLabel(member.role)}</span>
                          <OXMTooltip
                            text={roleOptions.find(opt => opt.value === member.role)?.description || ''}
                            position="bottom"
                            delay={200}
                          >
                            <Info size={14} className="role-info-icon" />
                          </OXMTooltip>
                        </div>
                        <ChevronDown size={14} className={isDropdownOpen ? 'open' : ''} />
                      </button>
                      {isDropdownOpen && (
                        <div className="role-dropdown-menu">
                          {roleOptions
                            .filter(opt => opt.value !== member.role)
                            .map((option) => (
                            <button
                              key={option.value}
                              className="role-option"
                              onClick={() => handleRoleChangeClick(member.id_user, option.value, member.username)}
                            >
                              <div className="role-option-content">
                                {option.icon}
                                <span>{option.label}</span>
                              </div>
                              <OXMTooltip text={option.description} position="bottom" delay={200}>
                                <Info size={14} className="role-info-icon" />
                              </OXMTooltip>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {!canChangeRole && (
                    <div className="member-role-display">
                      {getRoleIcon(member.role)}
                      <span>{getRoleLabel(member.role)}</span>
                      <OXMTooltip
                        text={roleOptions.find(opt => opt.value === member.role)?.description || ''}
                        position="bottom"
                        delay={200}
                      >
                        <Info size={14} className="role-info-icon" />
                      </OXMTooltip>
                    </div>
                  )}

                  {canRemove && (
                    <button
                      className="remove-member-btn"
                      onClick={() => handleRemoveMemberClick(member.id_user, member.username)}
                      disabled={deletingMemberId === member.id_user}
                      title="Retirer du membre de l'équipe"
                    >
                      <UserX size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          }          )}
        </div>
      )}

      <OXMModal isOpen={showAdminConfirmModal} onClose={() => {
        setShowAdminConfirmModal(false);
        setPendingRoleChange(null);
      }} variant="default">
        <div className="admin-confirm-modal">
          <div className="modal-header">
            <div className="modal-header-content">
              <div className="modal-icon-wrapper admin">
                <Shield size={24} />
              </div>
              <h3 className="modal-title orbitron">Promouvoir en Administrateur</h3>
            </div>
            <button className="modal-close-btn" onClick={() => {
              setShowAdminConfirmModal(false);
              setPendingRoleChange(null);
            }}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-content">
            <p className="modal-message">
              Êtes-vous sûr de vouloir promouvoir <strong>{pendingRoleChange?.memberUsername}</strong> au rang d'<strong>Administrateur</strong> ?
            </p>

            <div className="modal-permissions-info">
              <div className="permission-item">
                <Info size={18} className="info-icon" />
                <div className="permission-text">
                  <strong>L'Administrateur aura tous les droits :</strong>
                  <ul>
                    <li>Accès aux paramètres de l'équipe</li>
                    <li>Gestion des candidatures</li>
                    <li>Historique des tournois</li>
                    <li>Gestion des membres (changer rôles, supprimer)</li>
                    <li>Toutes les fonctionnalités du capitaine</li>
                  </ul>
                </div>
              </div>
              <div className="permission-item captain-only">
                <Info size={18} className="info-icon" />
                <div className="permission-text">
                  <strong>Seul le Capitaine peut :</strong>
                  <ul>
                    <li>Inscrire l'équipe aux tournois avec certains membres</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="modal-btn cancel"
              onClick={() => {
                setShowAdminConfirmModal(false);
                setPendingRoleChange(null);
              }}
            >
              Non
            </button>
            <button
              className="modal-btn confirm"
              onClick={handleConfirmAdminRole}
              disabled={updatingRoleMemberId === pendingRoleChange?.memberId}
            >
              {updatingRoleMemberId === pendingRoleChange?.memberId ? 'Chargement...' : 'Oui'}
            </button>
          </div>
        </div>
      </OXMModal>

      <OXMModal isOpen={showDeleteConfirmModal} onClose={() => {
        setShowDeleteConfirmModal(false);
        setMemberToDelete(null);
      }} variant="default">
        <div className="delete-confirm-modal">
          <div className="modal-header">
            <div className="modal-header-content">
              <div className="modal-icon-wrapper delete">
                <UserX size={24} />
              </div>
              <h3 className="modal-title">Retirer un membre</h3>
            </div>
            <button className="modal-close-btn" onClick={() => {
              setShowDeleteConfirmModal(false);
              setMemberToDelete(null);
            }}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-content">
            <p className="modal-message">
              Êtes-vous sûr de vouloir retirer <strong>{memberToDelete?.username}</strong> de l'équipe ?
            </p>
            <p className="modal-warning">
              Cette action est irréversible. Le membre perdra tous ses accès à l'équipe.
            </p>
          </div>

          <div className="modal-actions">
            <button
              className="modal-btn cancel"
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setMemberToDelete(null);
              }}
            >
              Annuler
            </button>
            <button
              className="modal-btn confirm delete"
              onClick={handleConfirmDeleteMember}
              disabled={deletingMemberId === memberToDelete?.id}
            >
              {deletingMemberId === memberToDelete?.id ? 'Suppression...' : 'Confirmer la suppression'}
            </button>
          </div>
        </div>
      </OXMModal>
    </div>
  );
};

export default TeamMembers;
