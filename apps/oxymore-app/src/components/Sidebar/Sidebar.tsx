import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Home, Trophy, Layers, Play, Users, UserPlus, LogOut, ChevronLeft, Bot, Menu, X, Store, Users2, BookOpen, AlertTriangle } from "lucide-react";
import Logo from "./../../assets/logo.png";
import "./Sidebar.scss";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [hasTeam, setHasTeam] = useState(false); // Simuler si l'utilisateur a une équipe
  const navRef = useRef<HTMLElement>(null);

  // Charger l'état de la sidebar depuis localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('oxymore-sidebar-collapsed');
    if (savedSidebarState !== null) {
      const isCollapsedFromStorage = JSON.parse(savedSidebarState);
      if (isCollapsedFromStorage !== isCollapsed && onToggle) {
        onToggle();
      }
    }
  }, []);

  // Sauvegarder l'état de la sidebar dans localStorage
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
      localStorage.setItem('oxymore-sidebar-collapsed', JSON.stringify(!isCollapsed));
    }
  };

  useEffect(() => {
    const checkScrollable = () => {
      if (navRef.current) {
        const { scrollHeight, clientHeight } = navRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  const handleNavClick = () => setMobileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('useroxm');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleStoreClick = () => {
    // Redirection vers le sous-domaine store
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


        <nav className={`oxm-sidebar__nav ${showScrollIndicator ? 'has-scroll-indicator' : ''}`} ref={navRef}>
          {/* Section Principale */}
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

          {/* Section Compétition */}
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

          {/* Section Social */}
          <div className="nav-section">
            <div className="section-label">Social</div>
            <ul>
              <li>
                <NavLink to="/teams" onClick={handleNavClick} className="oxm-sidebar-nav-link">
                  <Users size={20} /> <span>Teams</span>
                </NavLink>
                {!hasTeam && !isCollapsed && (
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

          {/* Section Outils */}
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
