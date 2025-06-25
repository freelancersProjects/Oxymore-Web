import React, { useState } from "react";
import "./Header.scss";
import { FiBell } from "react-icons/fi";
import DrawerNotif from "./DrawerNotif/DrawerNotif";

interface HeaderProps {
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed = false }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  // Pour le badge, on peut mocker le nombre de notifs non lues ici aussi si besoin
  const unreadCount = 2;

  return (
    <header className={`oxm-header${isSidebarCollapsed ? ' collapsed' : ''}`}>
      <div className="oxm-header__search">
        <input type="text" placeholder="Search For a Game" />
      </div>
      <div className="oxm-header__actions">
        <div className="icon-bell-wrapper" onClick={() => setNotifOpen(true)}>
          <FiBell className="icon-bell" />
          {unreadCount > 0 && <span className="notif-badge-header">{unreadCount}</span>}
        </div>
        <img
          className="avatar"
          src="https://i.pravatar.cc/50"
          alt="User Avatar"
        />
        <DrawerNotif open={notifOpen} onClose={() => setNotifOpen(false)} />
      </div>
    </header>
  );
};
