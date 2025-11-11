import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { OXMButton } from '@oxymore/ui';
import { Eye, Sword, ChevronDown } from 'lucide-react';
import { teamService } from '../../../services/teamService';
import TeamToolbar, { type TeamTab } from '../TeamToolbar/TeamToolbar';
import TeamChat from './TeamChat/TeamChat';
import TeamMembers from './TeamMembers/TeamMembers';
import TeamChallenges from './TeamChallenges/TeamChallenges';
import TeamMatchHistory from './TeamMatchHistory/TeamMatchHistory';
import TeamApplications from './TeamApplications/TeamApplications';
import TeamTournamentHistory from './TeamTournamentHistory/TeamTournamentHistory';
import TeamSettings from './TeamSettings/TeamSettings';
import type { Team, TeamMemberResponse, TeamApplication } from '../../../types/team';
import DEFAULT_TEAM_BANNER from '../../../assets/images/team/default_banner.png';
import DEFAULT_TEAM_LOGO from '../../../assets/images/team/default_logo.png';
import './TeamView.scss';

const VALID_TABS: TeamTab[] = ['messages', 'members', 'challenges', 'matchHistory', 'applications', 'tournamentHistory', 'settings'];
const DEFAULT_TAB: TeamTab = 'messages';
const STORAGE_KEY = 'teamViewActiveTab';

const TeamView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeTab, setActiveTab] = useState<TeamTab>(DEFAULT_TAB);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [pendingChallengesCount, setPendingChallengesCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const tabFromUrl = searchParams.get('tab');
    const tabFromStorage = localStorage.getItem(`${STORAGE_KEY}_${id}`);

    if (tabFromUrl && VALID_TABS.includes(tabFromUrl as TeamTab)) {
      setActiveTab(tabFromUrl as TeamTab);
    } else if (tabFromStorage && VALID_TABS.includes(tabFromStorage as TeamTab)) {
      setActiveTab(tabFromStorage as TeamTab);
      setSearchParams({ tab: tabFromStorage as TeamTab }, { replace: true });
    } else {
      setActiveTab(DEFAULT_TAB);
      if (!tabFromUrl) {
        setSearchParams({ tab: DEFAULT_TAB }, { replace: true });
      }
    }
  }, [id]);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl as TeamTab) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl as TeamTab);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadTeamDataAndCheckAccess = async () => {
      if (!id) return;

      try {
        setTeamLoading(true);

        const userStr = localStorage.getItem("useroxm");
        const user = userStr ? JSON.parse(userStr) : null;
        if (!user) {
          setHasAccess(false);
          setTeamLoading(false);
          return;
        }

        const team = await teamService.getTeamById(id);
        setTeamData(team);

        const members = await teamService.getTeamMembersByTeamId(id);
        const currentUserMember = members.find((member: TeamMemberResponse) => member.id_user === user.id_user);

        if (!currentUserMember) {
          setHasAccess(false);
          setIsAdmin(false);
          setTeamLoading(false);
          return;
        }

        setHasAccess(true);
        const isUserAdmin = currentUserMember.role === 'captain' || currentUserMember.role === 'admin';
        setIsAdmin(isUserAdmin);

        if (isUserAdmin) {
          try {
            const applications = await teamService.getTeamApplications(id);
            const pendingCount = applications.filter((app: TeamApplication) => app.status === 'pending').length;
            setPendingApplicationsCount(pendingCount);
          } catch (error) {
          }
        }

        try {
          const challenges = await teamService.getTeamChallenges(id);
          const pendingChallenges = challenges.filter((challenge: any) =>
            challenge.status === 'pending' && challenge.id_team_challenged === id
          ).length;
          setPendingChallengesCount(pendingChallenges);
        } catch (error) {
        }

        setTeamLoading(false);
      } catch (error) {
        setHasAccess(false);
        setIsAdmin(false);
        setTeamLoading(false);
      }
    };

    loadTeamDataAndCheckAccess();
  }, [id]);

  const handleTabChange = (tab: TeamTab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
    if (id) {
      localStorage.setItem(`${STORAGE_KEY}_${id}`, tab);
    }
  };

  const refreshApplicationsCount = async () => {
    if (!id || !isAdmin) return;
    try {
      const applications = await teamService.getTeamApplications(id);
      const pendingCount = applications.filter((app: TeamApplication) => app.status === 'pending').length;
      setPendingApplicationsCount(pendingCount);
    } catch (error) {
    }
  };

  const refreshChallengesCount = async () => {
    if (!id) return;
    try {
      const challenges = await teamService.getTeamChallenges(id);
      const pendingChallenges = challenges.filter((challenge: any) =>
        challenge.status === 'pending' && challenge.id_team_challenged === id
      ).length;
      setPendingChallengesCount(pendingChallenges);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (id) {
      refreshChallengesCount();

      const interval = setInterval(() => {
        refreshChallengesCount();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [activeTab, id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (teamLoading) {
    return (
      <div className="team-view-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="team-view-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h1 style={{ color: 'white', marginBottom: '20px' }}>Accès refusé</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '30px' }}>
            Vous n'avez pas accès à cette équipe.
          </p>
          <OXMButton variant="primary" onClick={() => navigate('/teams')}>
            Retour
          </OXMButton>
        </div>
      </div>
    );
  }

  return (
    <div className="team-view-container">
      <div className="team-banner-section">
        <div
          className="team-banner-background"
          style={{
            backgroundImage: teamData?.banner
              ? `url(${teamData.banner})`
              : `url(${DEFAULT_TEAM_BANNER})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="banner-overlay"></div>
        </div>
        <div className="team-info-overlay">
          <img
            src={teamData?.logo || DEFAULT_TEAM_LOGO}
            alt="Team Logo"
            className="team-logo-banner"
          />
          <div className="team-info-content">
            <h2 className="team-name-banner">
              {teamData?.name || "Loading..."}
            </h2>
            <p className="team-subtitle-banner">
              {teamData?.description || "no description"}
            </p>
          </div>
          <div className="team-actions-dropdown" ref={dropdownRef}>
            <button
              className="team-actions-dropdown-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Actions
              <ChevronDown size={18} className={isDropdownOpen ? 'open' : ''} />
            </button>
            {isDropdownOpen && (
              <div className="team-actions-dropdown-menu">
                <button
                  className="team-actions-dropdown-item"
                  onClick={() => {
                    if (id) {
                      navigate(`/teams/public/${id}`);
                    }
                    setIsDropdownOpen(false);
                  }}
                >
                  <Eye size={18} />
                  Voir la page publique
                </button>
                <button
                  className="team-actions-dropdown-item"
                  onClick={() => {
                    navigate('/teams');
                    setIsDropdownOpen(false);
                  }}
                >
                  <Sword size={18} />
                  Défier des équipes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h1 className="team-chat-title">Team Overview</h1>
      <TeamToolbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isAdmin={isAdmin}
        pendingApplicationsCount={pendingApplicationsCount}
        unreadMessagesCount={unreadMessagesCount}
        pendingChallengesCount={pendingChallengesCount}
      />

      {id && (
        <>
          <TeamChat teamId={id} teamData={teamData} onUnreadCountChange={setUnreadMessagesCount} isActive={activeTab === 'messages'} />
          {activeTab === 'members' && <TeamMembers teamId={id} teamData={teamData} />}
          {activeTab === 'challenges' && <TeamChallenges teamId={id} teamData={teamData} />}
          {activeTab === 'matchHistory' && <TeamMatchHistory teamId={id} teamData={teamData} />}
          {activeTab === 'applications' && (
            <TeamApplications
              teamId={id}
              teamData={teamData}
              onApplicationStatusChange={refreshApplicationsCount}
            />
          )}
          {activeTab === 'tournamentHistory' && <TeamTournamentHistory teamId={id} teamData={teamData} />}
          {activeTab === 'settings' && <TeamSettings teamId={id} teamData={teamData} onTeamUpdate={setTeamData} />}
        </>
      )}
    </div>
  );
};

export default TeamView;
