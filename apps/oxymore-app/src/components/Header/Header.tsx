import React, { useState } from "react";
import "./Header.scss";
import { FaBell } from "react-icons/fa";
import DrawerNotif from "./DrawerNotif/DrawerNotif";
import apiService from '../../api/apiService';

interface HeaderProps {
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed = false }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = "1";

  const fetchUnreadCount = async () => {
    try {
      const res = await apiService.get(`/notifications/user/${userId}/unread-count`);
      setUnreadCount(res.count);
    } catch (e) {
      setUnreadCount(0);
    }
  };

  React.useEffect(() => {
    fetchUnreadCount();
  }, []);

  React.useEffect(() => {
    if (!notifOpen) fetchUnreadCount();
  }, [notifOpen]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;

  return (
    <header className={`oxm-header${isSidebarCollapsed ? ' collapsed' : ''}`}>
      {!isMobile && (
        <div className="oxm-header__search">
          <input type="text" placeholder="Search For a Game" />
        </div>
      )}
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
        <DrawerNotif open={notifOpen} onClose={() => setNotifOpen(false)} userId={userId} />
      </div>
    </header>
  );
};
