import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Home, Trophy, Layers, Play, Users, UserPlus, LogOut, ChevronLeft, Bot, Menu, X, Store, Users2, BookOpen, AlertTriangle, ChevronDown, ExternalLink, Settings, KeyRound, Shield, MessageSquare } from "lucide-react";
import { gameService } from "../../services/gameService";
import { OXMBadge } from "@oxymore/ui";
import Logo from "./../../assets/logo.png";
import { teamService } from "../../services/teamService";
import { notificationService } from "../../services/notificationService";
import { friendService } from "../../services/friendService";
import { privateMessageService } from "../../services/privateMessageService";
import { useFriendRequestSocket } from "../../hooks/useFriendRequestSocket";
import { usePrivateMessageSocket } from "../../hooks/usePrivateMessageSocket";
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
  const [pendingFriendRequestsCount, setPendingFriendRequestsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [currentGame] = useState({ name: 'Counter-Strike 2', logo: gameService.getGameLogoByName('Counter-Strike 2') });
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
                  const unreadReplyCount = await notificationService.getUnreadCount(user.id_user);
                  totalNotifications += unreadReplyCount;
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
    const loadPendingFriendRequests = async () => {
      try {
        const userStr = localStorage.getItem("useroxm");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id_user) {
            const pendingRequests = await friendService.getPendingRequests(user.id_user);
            setPendingFriendRequestsCount(pendingRequests.length);
          }
        }
      } catch (error) {
      }
    };

    loadPendingFriendRequests();
  }, []);

  useEffect(() => {
    const loadUnreadMessagesCount = async () => {
      try {
        const userStr = localStorage.getItem("useroxm");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.id_user) {
            const conversations = await privateMessageService.getConversations();
            const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
            setUnreadMessagesCount(totalUnread);
          }
        }
      } catch (error) {
      }
    };

    loadUnreadMessagesCount();
  }, []);

  useFriendRequestSocket({
    onFriendRequestReceived: async (friendRequest) => {
      const userStr = localStorage.getItem("useroxm");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.id_user && friendRequest.id_user_receiver === user.id_user) {
          const pendingRequests = await friendService.getPendingRequests(user.id_user);
          setPendingFriendRequestsCount(pendingRequests.length);
        }
      }
    },
    onFriendRequestAccepted: async () => {
      const userStr = localStorage.getItem("useroxm");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.id_user) {
          const pendingRequests = await friendService.getPendingRequests(user.id_user);
          setPendingFriendRequestsCount(pendingRequests.length);
        }
      }
    },
    onFriendRequestRejected: async () => {
      const userStr = localStorage.getItem("useroxm");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.id_user) {
          const pendingRequests = await friendService.getPendingRequests(user.id_user);
          setPendingFriendRequestsCount(pendingRequests.length);
        }
      }
    }
  });

  usePrivateMessageSocket({
    friendId: null,
    onMessage: async (wsMessage) => {
      const userStr = localStorage.getItem("useroxm");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.id_user && wsMessage.receiver_id === user.id_user) {
          try {
            const conversations = await privateMessageService.getConversations();
            const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
            setUnreadMessagesCount(totalUnread);
          } catch (error) {
          }
        }
      }
    }
  });

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

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  return (
    <>
      {isMobile && (
        <button
          className="oxm-sidebar-burger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      )}
      {isMobile && (
        <div
          className={`oxm-sidebar-overlay${mobileOpen ? " open" : ""}`}
          onClick={() => setMobileOpen(false)}
        />
      )}
      {isCollapsed && !mobileOpen && !isMobile && (
        <div className="oxm-sidebar-collapsed-zone" onClick={onToggle} />
      )}
      <aside
        className={`oxm-sidebar${isCollapsed && !isMobile ? " collapsed" : ""}${
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
         <div className="oxm-sidebar__header">
           {mobileOpen && (
             <button
               className="oxm-sidebar-close"
               onClick={() => setMobileOpen(false)}
             >
               <X size={24} />
             </button>
           )}
           <div className="oxm-sidebar__header-content">
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
           </div>
           {onToggle && !isCollapsed && !isMobile && (
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
              <li>
                <button onClick={handleStoreClick} className="oxm-sidebar-nav-link store-nav-btn">
                  <Store size={20} />
                  <span>Store</span>
                  <ExternalLink size={14} />
                </button>
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
                  <OXMBadge count={pendingFriendRequestsCount} variant="sidebar" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/messages" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <MessageSquare size={20} /> <span>Messages</span>
                  <OXMBadge count={unreadMessagesCount} variant="sidebar" />
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

          {/* Section Paramètres - visible uniquement sur mobile */}
          {isMobile && (
            <div className="nav-section">
              <div className="section-label">Paramètres</div>
              <ul>
                <li>
                  <NavLink to="/settings" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                    <Settings size={20} /> <span>Settings</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/api-keys" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                    <KeyRound size={20} /> <span>API Access</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/security" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                    <Shield size={20} /> <span>Security</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}

          {showScrollArrow && (
            <div className="scroll-arrow-indicator">
              <ChevronDown size={16} />
            </div>
          )}
        </nav>

        <div className="oxm-sidebar__current-game">
          <div className="current-game-content">
            <div className="current-game-logo">
              {currentGame.logo ? (
                <img src={currentGame.logo} alt={currentGame.name} />
              ) : (
                <div className="current-game-placeholder">CS</div>
              )}
            </div>
            <div className="current-game-info">
              <div className="current-game-label">Jeu actuel</div>
              <div className="current-game-name">{currentGame.name}</div>
            </div>
          </div>
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
