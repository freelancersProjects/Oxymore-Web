import React, { useEffect, useState } from "react";
import "./Header.scss";
import { Bell as BellIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import DrawerNotif from "./DrawerNotif/DrawerNotif";
import apiService from '../../api/apiService';
import ProfilePanel from './ProfilePanel/ProfilePanel';

interface HeaderProps {
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed = false }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileCollapsed, setProfileCollapsed] = useState(false);
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

  useEffect(() => { fetchUnreadCount(); }, []);
  useEffect(() => { if (!notifOpen) fetchUnreadCount(); }, [notifOpen]);

  const setProfileClass = (collapsed: boolean) => {
    const root = document.querySelector('.oxm-layout');
    if (!root) return;
    if (collapsed) root.classList.add('profile-panel-collapsed');
    else root.classList.remove('profile-panel-collapsed');
  };

  const toggleProfile = () => {
    setProfileCollapsed(prev => {
      const next = !prev;
      setProfileClass(next);
      return next;
    });
  };

  const openNotif = () => {
    setNotifOpen(true);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;

  return (
    <>
      <header className={`oxm-header${isSidebarCollapsed ? ' collapsed' : ''}`}>
        {!isMobile && (
          <div className="oxm-header__search">
            <input type="text" placeholder="Search For a Game" />
          </div>
        )}
        <div className="oxm-header__actions">
          <div className="icon-bell-wrapper" onClick={openNotif}>
            <BellIcon className="icon-bell" size={24} />
            {unreadCount > 0 && <span className="notif-badge-header">{unreadCount}</span>}
          </div>
          <DrawerNotif open={notifOpen} onClose={() => setNotifOpen(false)} userId={userId} />
        </div>
      </header>
      <div className="profile-toggle-button" onClick={toggleProfile}>
        {profileCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </div>
      <ProfilePanel collapsed={profileCollapsed} />
    </>
  );
};
