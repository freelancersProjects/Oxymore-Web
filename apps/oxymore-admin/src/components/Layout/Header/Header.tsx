import React,{ useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  ChevronRight,
  Command,
  Menu,
  X,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useSidebar } from '../../../context/SidebarContext';
import { useTheme } from '../../../context/ThemeContext';
import ShortcutsModal from './ShortcutsModal';
import SearchBar from '../../SearchBar/SearchBar';
import { notificationAdminService, NotificationAdmin } from '../../../services/notificationAdminService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const Header = () => {
  const { user, logout } = useAuth();
  const { isMobile, toggleMobileMenu, isMobileMenuOpen } = useSidebar();
  const { currentTheme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileNotifModal, setShowMobileNotifModal] = useState(false);
  const [notifications, setNotifications] = useState<NotificationAdmin[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Gestionnaire de raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘ + / pour ouvrir les raccourcis
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      // ⌘ + B pour toggle la sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleMobileMenu();
      }
      // ⌘ + K pour focus la recherche
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isMobile) {
          setShowMobileSearch(true);
        } else {
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          searchInput?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, toggleMobileMenu]);

  // Charger les notifications admin
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [notifs, count] = await Promise.all([
        notificationAdminService.getAll(),
        notificationAdminService.getUnreadCount()
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading admin notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications au montage et toutes les 30 secondes
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Actualiser toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  // Gestionnaire de clic en dehors pour fermer les dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marquer une notification comme lue
  const handleMarkAsRead = async (notificationId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await notificationAdminService.markAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAdminService.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Formater la date relative
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch {
      return dateString;
    }
  };

  // Obtenir l'icône selon le type
  const getNotificationIcon = (type: 'message' | 'success' | 'alert') => {
    switch (type) {
      case 'success':
        return CheckCircle2;
      case 'alert':
        return AlertCircle;
      default:
        return MessageSquare;
    }
  };

  // Obtenir la couleur selon le type
  const getNotificationColor = (type: 'message' | 'success' | 'alert') => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'alert':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  const getUserInitials = () => {
    if (!user) return 'A';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.username.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return 'Admin';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || 'Admin';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--card-background)] border-b border-[var(--border-color)] backdrop-blur-sm">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Mobile Menu Button */}
        {isMobile && !showMobileSearch && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[var(--text-primary)]" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--text-primary)]" />
            )}
          </motion.button>
        )}

        {/* Search and Quick Actions - Desktop */}
        {!isMobile && (
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Search */}
            <div className="flex-1">
              <SearchBar placeholder="Search anything... (⌘ K)" />
            </div>

            {/* Quick Actions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShortcuts(true)}
              className="px-4 py-2 bg-gradient-oxymore text-white rounded-xl font-medium shadow-oxymore hover:shadow-oxymore-lg transition-all flex items-center gap-2"
            >
              <Command className="w-5 h-5" />
              <span>Quick Actions</span>
            </motion.button>
          </div>
        )}

        {/* Mobile Search Bar */}
        {isMobile && showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex-1"
          >
            <SearchBar placeholder="Search anything..." />
          </motion.div>
        )}

        {/* Actions */}
        <div className={`flex items-center gap-2 md:gap-4 ${isMobile && showMobileSearch ? 'hidden' : ''}`}>
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
            title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-5 h-5 text-[var(--text-primary)]" />
            ) : (
              <Moon className="w-5 h-5 text-[var(--text-primary)]" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isMobile) {
                  setShowMobileNotifModal(true);
                } else {
                  setShowNotifs(!showNotifs);
                }
              }}
              className="relative p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-[var(--text-primary)]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                    <h3 className="text-[var(--text-primary)] font-semibold">Notifications Admin</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 px-2 py-1 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Tout lire
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    {loading ? (
                      <div className="p-4 text-center text-[var(--text-secondary)] text-sm">Chargement...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-[var(--text-secondary)] text-sm">Aucune notification</div>
                    ) : (
                      notifications.map((notif) => {
                        const Icon = getNotificationIcon(notif.type);
                        const bgColor = getNotificationColor(notif.type);
                        return (
                          <motion.div
                            key={notif.id_notification_admin}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 hover:bg-[var(--overlay-hover)] rounded-lg cursor-pointer transition-colors ${
                              !notif.is_read ? 'bg-[var(--overlay-hover)]/50' : ''
                            }`}
                            onClick={() => !notif.is_read && handleMarkAsRead(notif.id_notification_admin)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={`text-sm font-medium ${!notif.is_read ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-primary)]'}`}>
                                    {notif.title}
                                  </h4>
                                  {!notif.is_read && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                                  )}
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{notif.text}</p>
                                <span className="text-xs text-[var(--text-muted)] mt-1 block">{formatTime(notif.created_at)}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 md:gap-3 p-1.5 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-oxymore flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
              </div>
              {!isMobile && (
                <div className="pr-2">
                  <p className="text-[var(--text-primary)] font-medium text-sm">{getDisplayName()}</p>
                  <p className="text-[var(--text-secondary)] text-xs">{user?.email}</p>
                </div>
              )}
              {!isMobile && (
                <ChevronRight className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${showProfile ? 'rotate-90' : ''}`} />
              )}
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl shadow-lg py-1"
                >
                  <div className="px-4 py-3 border-b border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-primary)] font-medium">{getDisplayName()}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--overlay-hover)]"
                    onClick={() => setShowProfile(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[var(--overlay-hover)]"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Search Toggle - Moved to the right */}
          {isMobile && !showMobileSearch && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileSearch(true)}
              className="p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
            >
              <Search className="w-5 h-5 text-[var(--text-primary)]" />
            </motion.button>
          )}
        </div>
      </div>
      </header>

      {/* Modal des raccourcis */}
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Mobile Notification Modal */}
      <AnimatePresence>
        {showMobileNotifModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowMobileNotifModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-background)] rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <h3 className="text-[var(--text-primary)] font-semibold">Notifications</h3>
                <button
                  onClick={() => setShowMobileNotifModal(false)}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  ✕
                </button>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-[var(--text-secondary)] text-sm">Chargement...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-[var(--text-secondary)] text-sm">Aucune notification</div>
                ) : (
                  <>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="w-full mb-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1 px-2 py-2 hover:bg-[var(--overlay-hover)] rounded-lg transition-colors"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Marquer tout comme lu
                      </button>
                    )}
                    {notifications.map((notif) => {
                      const Icon = getNotificationIcon(notif.type);
                      const bgColor = getNotificationColor(notif.type);
                      return (
                        <motion.div
                          key={notif.id_notification_admin}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 hover:bg-[var(--overlay-hover)] rounded-lg cursor-pointer transition-colors ${
                            !notif.is_read ? 'bg-[var(--overlay-hover)]/50' : ''
                          }`}
                          onClick={() => !notif.is_read && handleMarkAsRead(notif.id_notification_admin)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm font-medium ${!notif.is_read ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-primary)]'}`}>
                                  {notif.title}
                                </h4>
                                {!notif.is_read && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{notif.text}</p>
                              <span className="text-xs text-[var(--text-muted)] mt-1 block">{formatTime(notif.created_at)}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;


