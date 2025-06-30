import React, { useState } from "react";
import "./Header.scss";
import { FaBell } from "react-icons/fa";
import DrawerNotif from "./DrawerNotif/DrawerNotif";

interface HeaderProps {
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed = false }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = 3;

  return (
    <header className={`oxm-header${isSidebarCollapsed ? ' collapsed' : ''}`}>
      <div className="oxm-header__search">
        <input type="text" placeholder="Search For a Game" />
      </div>
      <div className="oxm-header__actions">
        <div className="icon-bell-wrapper" onClick={() => setNotifOpen(true)}>
          <FaBell className="icon-bell" />
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
