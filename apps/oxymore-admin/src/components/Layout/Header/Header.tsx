import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Plus,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Command
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import ShortcutsModal from './ShortcutsModal';

const notifications = [
  { title: 'New Tournament Registration', desc: 'Team_Alpha joined CS2 Major', time: '2 min ago' },
  { title: 'Match Starting Soon', desc: 'NextGen vs Team_Beta in 30min', time: '5 min ago' },
  { title: 'New Report', desc: 'User reported for toxic behavior', time: '1h ago' }
];

const Header = () => {
  const { user, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Gestionnaire de raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘ + / pour ouvrir les raccourcis
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      // ⌘ + B pour toggle la sidebar (à implémenter)
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        // TODO: Implémenter le toggle de la sidebar
      }
      // ⌘ + K pour focus la recherche
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <header className="sticky top-0 z-40 bg-[var(--card-background)] border-b border-[var(--border-color)] backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search and Quick Actions */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search anything... (⌘ K)"
                className="w-full bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-oxymore-purple/50"
              />
            </div>
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

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-[var(--text-primary)]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                3
              </span>
            </motion.button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b border-[var(--border-color)]">
                    <h3 className="text-[var(--text-primary)] font-semibold">Notifications</h3>
                  </div>
                  <div className="p-2">
                    {notifications.map((notif, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 hover:bg-[var(--overlay-hover)] rounded-lg cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-oxymore rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-[var(--text-primary)] font-medium">{notif.title}</h4>
                            <p className="text-sm text-[var(--text-secondary)]">{notif.desc}</p>
                            <span className="text-xs text-[var(--text-muted)]">{notif.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-1.5 bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] rounded-xl transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-oxymore flex items-center justify-center">
                <span className="text-white font-semibold">{getUserInitials()}</span>
              </div>
              <div className="pr-2">
                <p className="text-[var(--text-primary)] font-medium">{getDisplayName()}</p>
                <p className="text-[var(--text-secondary)] text-xs">{user?.email}</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${showProfile ? 'rotate-90' : ''}`} />
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
        </div>
      </div>

      {/* Modal des raccourcis */}
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </header>
  );
};

export default Header; 
 
 
 