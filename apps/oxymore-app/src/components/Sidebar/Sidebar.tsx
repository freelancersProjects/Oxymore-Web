import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Trophy, Layers, Play, Users, UserPlus, Code, LogOut, ChevronLeft, ChevronRight, Bot, Menu, X } from "lucide-react";
import Logo from "./../../assets/logo.png";
import "./Sidebar.scss";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ferme la sidebar mobile au clic sur un lien
  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      {/* Burger menu visible sur mobile */}
      <button className="oxm-sidebar-burger" onClick={() => setMobileOpen(true)}>
        <Menu size={28} />
      </button>
      {/* Overlay mobile */}
      <div className={`oxm-sidebar-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`oxm-sidebar${isCollapsed ? ' collapsed' : ''}${mobileOpen ? ' open' : ''}`}>
        {/* Croix de fermeture mobile */}
        {mobileOpen && (
          <button className="oxm-sidebar-close" onClick={() => setMobileOpen(false)}>
            <X size={32} />
          </button>
        )}
        <div className="oxm-sidebar__header">
          <div className="oxm-sidebar__logo">
            <NavLink to="/" onClick={handleNavClick}>
              <img src={Logo} alt="Oxymore Logo" />
            </NavLink>
          </div>
          {onToggle && (
            <button className="oxm-sidebar__toggle" onClick={onToggle}>
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        <nav className="oxm-sidebar__nav">
          <ul>
            <li>
              <NavLink to="/" end onClick={handleNavClick}>
                <Home size={20} /> <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tournaments" onClick={handleNavClick}>
                <Trophy size={20} /> <span>Tournaments</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/leagues" onClick={handleNavClick}>
                <Layers size={20} /> <span>Leagues</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/highlights" onClick={handleNavClick}>
                <Play size={20} /> <span>Highlights</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/teams" onClick={handleNavClick}>
                <Users size={20} /> <span>Teams</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/friends" onClick={handleNavClick}>
                <UserPlus size={20} /> <span>Friends</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/api-keys" onClick={handleNavClick}>
                <Code size={20} /> <span>API</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/oxia" onClick={handleNavClick}>
                <Bot size={20} /> <span>Oxia</span>
                <span className="sidebar-beta-chip">Bêta</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="oxm-sidebar__logout">
          <button>
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
