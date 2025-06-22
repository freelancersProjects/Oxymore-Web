import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Trophy, Layers, Play, Users, UserPlus, Code, LogOut } from "lucide-react";
import Logo from "./../../../assets/logo.png";
import "./Sidebar.scss";

export const Sidebar = () => {
  return (
    <aside className="oxm-sidebar">
      <div className="oxm-sidebar__logo">
        <img src={Logo} alt="Oxymore Logo" />
      </div>

      <nav className="oxm-sidebar__nav">
        <ul>
          <li>
            <NavLink to="/" end>
              <Home size={20} /> <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tournaments">
              <Trophy size={20} /> <span>Tournaments</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/leagues">
              <Layers size={20} /> <span>Leagues</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/highlights">
              <Play size={20} /> <span>Highlights</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/teams">
              <Users size={20} /> <span>Teams</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/friends">
              <UserPlus size={20} /> <span>Friends</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/api-keys">
              <Code size={20} /> <span>API</span>
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
  );
};
