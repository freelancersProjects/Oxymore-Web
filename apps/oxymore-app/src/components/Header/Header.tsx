import React, { useEffect, useState } from "react";
import "./Header.scss";
import { Bell as BellIcon, Search } from 'lucide-react';
import DrawerNotif from "./DrawerNotif/DrawerNotif";
import apiService from '../../api/apiService';
import ProfilePanel from './ProfilePanel/ProfilePanel';

interface HeaderProps {
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed = false }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileCollapsed, setProfileCollapsed] = useState(() => {
    // Charger l'état depuis localStorage, par défaut fermé (true)
    const saved = localStorage.getItem('profilePanelCollapsed');
    const isCollapsed = saved ? JSON.parse(saved) : true;

    // Appliquer immédiatement la classe CSS pour éviter le flash
    const root = document.querySelector('.oxm-layout');
    if (root && !isCollapsed) {
      root.classList.add('profile-panel-expanded');
    }

    return isCollapsed;
  });
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

  // Gestion du scroll pour la search bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { fetchUnreadCount(); }, []);
  useEffect(() => { if (!notifOpen) fetchUnreadCount(); }, [notifOpen]);

  const toggleProfile = () => {
    setProfileCollapsed((prev: boolean) => {
      const next = !prev;
      const root = document.querySelector('.oxm-layout');
      if (root) {
        if (next) {
          root.classList.remove('profile-panel-expanded');
        } else {
          root.classList.add('profile-panel-expanded');
        }
      }
      localStorage.setItem('profilePanelCollapsed', JSON.stringify(next));
      return next;
    });
  };

  const openNotif = () => {
    setNotifOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;

  return (
    <>
      <header className={`oxm-header${isSidebarCollapsed ? ' collapsed' : ''}`}>
        {!isMobile && (
          <div className={`oxm-header__search${isScrolled ? ' scrolled' : ''}`}>
            <form onSubmit={handleSearchSubmit} className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search games, tournaments, players..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
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

      <ProfilePanel collapsed={profileCollapsed} onToggle={toggleProfile} />
    </>
  );
};
