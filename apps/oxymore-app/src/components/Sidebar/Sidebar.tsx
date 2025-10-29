import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Home, Trophy, Layers, Play, Users, UserPlus, LogOut, ChevronLeft, Bot, Menu, X, Store, Users2, BookOpen, AlertTriangle, ChevronDown } from "lucide-react";
import { OXMBadge } from "@oxymore/ui";
import Logo from "./../../assets/logo.png";
import { teamService } from "../../services/teamService";
import "./Sidebar.scss";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(() => {
    return sessionStorage.getItem('sidebar-has-scrolled') === 'true';
  });
    const [isCheckingTeam, setIsCheckingTeam] = useState(true);

  const [hasTeam, setHasTeam] = useState(false);
  const [teamNotificationsCount, setTeamNotificationsCount] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem('oxymore-sidebar-collapsed');
    if (savedSidebarState !== null) {
      const isCollapsedFromStorage = JSON.parse(savedSidebarState);
      if (isCollapsedFromStorage !== isCollapsed && onToggle) {
        onToggle();
      }
    }
  }, []);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
      localStorage.setItem('oxymore-sidebar-collapsed', JSON.stringify(!isCollapsed));
    }
  };

  useEffect(() => {
    const checkUserTeam = async () => {
      try {
        setIsCheckingTeam(true);
        const userStr = localStorage.getItem("useroxm");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id_user) {
            const data = await teamService.getUserTeam(user.id_user);
            setHasTeam(data.hasTeam);

            if (data.hasTeam && data.teamMember?.id_team) {
              const teamId = data.teamMember.id_team;

              let totalNotifications = 0;

              try {
                const members = await teamService.getTeamMembersByTeamId(teamId);
                const currentUserMember = members.find((member: any) => member.id_user === user.id_user);
                const isAdmin = currentUserMember?.role === 'captain' || currentUserMember?.role === 'admin';

                try {
                  const chats = await teamService.getTeamChats(teamId);
                  const lastSeenKey = `team_chat_last_seen_${teamId}_${user.id_user}`;
                  const lastSeenTimestamp = localStorage.getItem(lastSeenKey);

                  if (lastSeenTimestamp) {
                    const lastSeenDate = new Date(lastSeenTimestamp);
                    const unreadCount = chats.filter((chat: any) => {
                      const msgDate = new Date(chat.sent_at);
                      return chat.id_user !== user.id_user && msgDate > lastSeenDate;
                    }).length;
                    totalNotifications += unreadCount;
                  } else {
                    const unreadCount = chats.filter((chat: any) => {
                      return chat.id_user !== user.id_user;
                    }).length;
                    totalNotifications += unreadCount;
                  }
                } catch (error) {
                }

                if (isAdmin) {
                  try {
                    const applications = await teamService.getTeamApplications(teamId);
                    const pendingCount = applications.filter((app: any) => app.status === 'pending').length;
                    totalNotifications += pendingCount;
                  } catch (error) {
                  }
                }

                try {
                  const challenges = await teamService.getTeamChallenges(teamId);
                  const pendingChallenges = challenges.filter((challenge: any) =>
                    challenge.status === 'pending' && challenge.id_team_challenged === teamId
                  ).length;
                  totalNotifications += pendingChallenges;
                } catch (error) {
                }
              } catch (error) {
              }

              setTeamNotificationsCount(totalNotifications);
            }
          }
        }
      } catch (error) {
      } finally {
        setIsCheckingTeam(false);
      }
    };

    checkUserTeam();

    const interval = setInterval(() => {
      checkUserTeam();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkScrollable = () => {
      if (navRef.current) {
        const { scrollHeight, clientHeight } = navRef.current;
        setShowScrollArrow(scrollHeight > clientHeight && !hasScrolled);
      }
    };

    const handleScroll = () => {
      if (navRef.current && !hasScrolled) {
        setHasScrolled(true);
        sessionStorage.setItem('sidebar-has-scrolled', 'true');
        setShowScrollArrow(false);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    if (navRef.current) {
      navRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('resize', checkScrollable);
      if (navRef.current) {
        navRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasScrolled]);

  const handleNavClick = () => setMobileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('useroxm');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleStoreClick = () => {
    window.open('https://store.oxymore.com', '_blank');
  };

  return (
    <>
      <button
        className="oxm-sidebar-burger"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={28} />
      </button>
      <div
        className={`oxm-sidebar-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      {isCollapsed && !mobileOpen && (
        <div className="oxm-sidebar-collapsed-zone" onClick={onToggle} />
      )}
      <aside
        className={`oxm-sidebar${isCollapsed ? " collapsed" : ""}${
          mobileOpen ? " open" : ""
        }`}
        onClick={(e) => {
          if (isCollapsed) {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest("a")) return;
            if (onToggle) handleToggle();
          }
        }}
      >
        {mobileOpen && (
          <button
            className="oxm-sidebar-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={32} />
          </button>
        )}
        <div className="oxm-sidebar__header">
          <div className="oxm-sidebar__logo">
            <NavLink to="/" onClick={handleNavClick}>
              <img src={Logo} alt="Oxymore Logo" />
            </NavLink>
          </div>
          <div className="oxm-sidebar__user-plan">
            <div className="user-info">
              <div className="user-name">Mathis Boulais</div>
              <div className="plan-status">
                <span className="plan-text">Free Plan</span>
                <NavLink to="/subscription" className="upgrade-link" onClick={handleNavClick}>
                  Upgrade
                </NavLink>
              </div>
            </div>
          </div>
          {onToggle && !isCollapsed && (
            <button className="oxm-sidebar__toggle" onClick={handleToggle}>
              <ChevronLeft size={16} />
            </button>
          )}
        </div>


        <nav className="oxm-sidebar__nav" ref={navRef}>
          <div className="nav-section">
            <div className="section-label">Principal</div>
            <ul>
              <li>
                <NavLink to="/" end onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <Home size={20} /> <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/highlights" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <Play size={20} /> <span>Highlights</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="section-label">Compétition</div>
            <ul>
              <li>
                <NavLink to="/leagues" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <Layers size={20} /> <span>Leagues</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/tournaments" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <Trophy size={20} /> <span>Tournaments</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/matchmaking" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <Users2 size={20} /> <span>Matchmaking</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="section-label">Social</div>
            <ul>
              <li>
                <NavLink to="/teams" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <Users size={20} /> <span>Teams</span>
                  <OXMBadge count={teamNotificationsCount} variant="sidebar" />
                </NavLink>
                {!hasTeam && !isCollapsed && !isCheckingTeam && (
                  <div className="team-warning">
                    <AlertTriangle size={14} />
                    <span>Pas d'équipe</span>
                  </div>
                )}
              </li>
              <li>
                <NavLink to="/friends" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <UserPlus size={20} /> <span>Friends</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="section-label">Outils</div>
            <ul>
              <li>
                <NavLink to="/oxia" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <Bot size={20} /> <span>Oxia</span>
                  <span className="oxm-sidebar-beta-chip">Bêta</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/game-learning" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <BookOpen size={20} /> <span>Apprendre</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {showScrollArrow && (
            <div className="scroll-arrow-indicator">
              <ChevronDown size={16} />
            </div>
          )}
        </nav>

        <div className="oxm-sidebar__store">
          <button onClick={handleStoreClick} className="store-btn">
            <Store size={20} />
            <span>Store</span>
          </button>
        </div>

        <div className="oxm-sidebar__logout">
          <button onClick={handleLogout}>
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
