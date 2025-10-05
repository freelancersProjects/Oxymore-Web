
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../../../public/logo.png';
import LogoPuple from '../../../../public/logo-purple.png';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Trophy,
  Shield,
  Target,
  Calendar,
  Star,
  Settings,
  TrendingUp,
  Activity,
  ChevronRight,
  LogOut,
  CheckSquare,
  FileText,
  Zap
} from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import { useAuth } from '../../../context/AuthContext';
import { useStats } from '../../../context/StatsContext';
import { NavItem } from '../../../types';
import { useState, useEffect, useRef } from 'react';

const useThemeDetector = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const lastThemeRef = useRef<string>('');

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const effectiveTheme = theme || (systemPrefersDark ? 'dark' : 'light');

      if (effectiveTheme !== lastThemeRef.current) {
        lastThemeRef.current = effectiveTheme;
        setCurrentTheme(effectiveTheme as 'light' | 'dark');
      }
    };

    checkTheme();

    const interval = setInterval(checkTheme, 16);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        checkTheme();
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      checkTheme();
    };

    window.addEventListener('storage', handleStorageChange);
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);
            console.log(import.meta.env.PASS_SIDEBAR)

  return currentTheme;
};

const NavLink = ({ item }: { item: NavItem }) => {
  const location = useLocation();
  const { isCollapsed, isMobile, closeMobileMenu } = useSidebar();
  const isActive = location.pathname === item.path;

  const handleClick = () => {
    if (isMobile) {
      closeMobileMenu();
    }
  };

  return (
    <Link to={item.path} className="flex" onClick={handleClick}>
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-between p-3 rounded-xl w-full transition-all duration-300 group ${
          isActive
            ? 'bg-gradient-oxymore text-white shadow-oxymore'
            : 'text-[var(--text-secondary)] hover:bg-[var(--overlay-hover)] hover:shadow-md hover:shadow-black/5 dark:hover:shadow-white/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`} />
          {(!isCollapsed || isMobile) && (
            <span className={`font-medium ${isActive ? 'text-white' : 'group-hover:text-[var(--text-primary)]'}`}>
              {item.label}
            </span>
          )}
        </div>

        {(!isCollapsed || isMobile) && (
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                item.color || 'bg-[var(--overlay-hover)]'
              } ${item.color ? 'text-white' : ''}`}>
                {item.badge}
              </span>
            )}
            <ChevronRight className={`w-4 h-4 transition-transform ${
              isActive ? 'rotate-90 text-white' : 'text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-[var(--text-primary)]'
            }`} />
          </div>
        )}
      </motion.div>
    </Link>
  );
};

const Sidebar = () => {
  const { isCollapsed, isMobile, isMobileMenuOpen, closeMobileMenu } = useSidebar();
  const { logout } = useAuth();
  const { stats, loading } = useStats();
  const currentTheme = useThemeDetector();

  const handleLogout = () => {
    logout();
    if (isMobile) {
      closeMobileMenu();
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const mainNav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Users', icon: Users, path: '/users', badge: loading ? '...' : formatNumber(stats.totalUsers) },
    { label: 'Tournaments', icon: Trophy, path: '/tournaments', badge: loading ? '...' : stats.totalTournaments.toString(), color: 'bg-gradient-purple' },
    { label: 'Teams', icon: Shield, path: '/teams', badge: loading ? '...' : stats.totalTeams.toString() },
    { label: 'Leagues', icon: Target, path: '/leagues', badge: loading ? '...' : stats.totalLeagues.toString() },
    { label: 'Matches', icon: Calendar, path: '/matches', badge: 'LIVE', color: 'bg-red-500' },
    { label: 'Badges', icon: Star, path: '/badges' },
    { label: 'Calendrier', icon: Calendar, path: '/calendar' },
    { label: 'Jira', icon: CheckSquare, path: '/jira', color: 'bg-gradient-blue' },
    { label: 'Confluence', icon: FileText, path: '/confluence', color: 'bg-gradient-green' },
    { label: 'WebP Converter', icon: Zap, path: '/webp-converter', color: 'bg-gradient-orange' }
  ];

  const statsNav = [
    { label: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { label: 'Activity', icon: Activity, path: '/activity' }
  ];

  const sidebarContent = (
    <aside className={`h-screen bg-[var(--card-background)] border-r border-[var(--border-color)] flex flex-col overflow-hidden ${
      isMobile ? 'w-full' : 'w-full'
    }`}>
      <div className="p-6 border-b border-[var(--border-color)]">
        <Link to="/dashboard">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <motion.img
              key={currentTheme}
              src={currentTheme === 'light' ? LogoPuple : Logo}
              alt="Oxymore Logo"
              className="w-12 h-13 transition-all duration-300"
              style={{
                filter: isCollapsed ? 'grayscale(0.5)' : 'none'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            {(!isCollapsed || isMobile) && (
              <h1 className="text-[var(--text-primary)] text-xl font-bold">
                Oxymore <span className="text-sm text-oxymore-purple-light">Admin</span>
              </h1>
            )}
          </motion.div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(!isCollapsed || isMobile) && (
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--overlay-hover)] p-3 rounded-xl">
                <h3 className="text-sm text-[var(--text-secondary)]">Active Users</h3>
                <div className="mt-1 flex items-end gap-1">
                  <span className="text-2xl font-bold text-[var(--text-primary)]">
                    {loading ? '...' : formatNumber(stats.activeUsers)}
                  </span>
                  <span className="text-xs text-emerald-400 mb-1">+5%</span>
                </div>
              </div>
              <div className="bg-[var(--overlay-hover)] p-3 rounded-xl">
                <h3 className="text-sm text-[var(--text-secondary)]">Live Matches</h3>
                <div className="mt-1 flex items-end gap-1">
                  <span className="text-2xl font-bold text-[var(--text-primary)]">
                    {loading ? '...' : stats.activeMatches}
                  </span>
                  <span className="text-xs text-red-400 mb-1">LIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 space-y-2">
          {(!isCollapsed || isMobile) && (
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] px-3 mb-3">MAIN MENU</h2>
          )}
          {mainNav.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>

        <div className="p-4 space-y-2">
          {(!isCollapsed || isMobile) && (
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] px-3 mb-3">ANALYTICS</h2>
          )}
          {statsNav.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>
      </div>

      <div className="p-4 space-y-2 border-t border-[var(--border-color)]">
        <NavLink item={{
          label: 'Settings',
          icon: Settings,
          path: '/settings',
          description: 'Manage your preferences'
        }} />
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {(!isCollapsed || isMobile) && (
            <span className="font-medium">Logout</span>
          )}
        </motion.button>
      </div>
    </aside>
  );

  // Version mobile avec overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Version desktop
  return sidebarContent;
};

export default Sidebar;

