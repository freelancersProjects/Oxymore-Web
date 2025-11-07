import React, { useEffect, useState } from "react";
import "./Header.scss";
import { Bell as BellIcon, Search } from 'lucide-react';
import apiService from '../../api/apiService';
import ProfilePanel from './ProfilePanel/ProfilePanel';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  isSidebarCollapsed?: boolean;
  hideProfileSidebar?: boolean;
  onNotificationClick?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed = false, hideProfileSidebar = false, onNotificationClick, unreadCount = 0 }) => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileCollapsed, setProfileCollapsed] = useState(() => {
    const saved = localStorage.getItem('profilePanelCollapsed');
    const isCollapsed = saved ? JSON.parse(saved) : true;

    const root = document.querySelector('.oxm-layout');
    if (root && !isCollapsed) {
      root.classList.add('profile-panel-expanded');
    }

    return isCollapsed;
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 700;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        </div>
      </header>

      {!hideProfileSidebar && !isMobile && (
        <ProfilePanel
          collapsed={profileCollapsed}
          onToggle={toggleProfile}
          onNotificationClick={openNotif}
          unreadCount={unreadCount}
        />
      )}
    </>
  );
};
