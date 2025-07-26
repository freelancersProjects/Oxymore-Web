import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  LogOut
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: any;
  path: string;
  badge?: number | string;
  color?: string;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Users', icon: Users, path: '/users', badge: '12.8K' },
  { label: 'Tournaments', icon: Trophy, path: '/tournaments', badge: '24', color: 'bg-gradient-purple' },
  { label: 'Teams', icon: Shield, path: '/teams', badge: '156' },
  { label: 'Leagues', icon: Target, path: '/leagues', badge: '8' },
  { label: 'Matches', icon: Calendar, path: '/matches', badge: 'LIVE', color: 'bg-red-500' },
  { label: 'Badges', icon: Star, path: '/badges' }
];

const statsNav: NavItem[] = [
  { label: 'Analytics', icon: TrendingUp, path: '/analytics' },
  { label: 'Activity', icon: Activity, path: '/activity' }
];

const Sidebar = () => {
  const location = useLocation();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link to={item.path}>
        <motion.div
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${
            isActive 
              ? 'bg-gradient-oxymore text-white shadow-oxymore' 
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
            <span className={`font-medium ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
              {item.label}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                item.color || 'bg-white/10'
              }`}>
                {item.badge}
              </span>
            )}
            <ChevronRight className={`w-4 h-4 transition-transform ${
              isActive ? 'rotate-90 text-white' : 'text-gray-600 group-hover:translate-x-1'
            }`} />
          </div>
        </motion.div>
      </Link>
    );
  };

  return (
    <div className="w-70 h-full bg-oxymore-dark-secondary border-r border-white/10">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/dashboard">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-oxymore rounded-xl flex items-center justify-center shadow-oxymore">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <h1 className="text-white text-xl font-bold">
              Oxymore <span className="text-sm text-oxymore-purple-light">Admin</span>
            </h1>
          </motion.div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="p-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-3 rounded-xl">
            <h3 className="text-sm text-gray-400">Active Users</h3>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-2xl font-bold text-white">1.2k</span>
              <span className="text-xs text-green-400 mb-1">+5%</span>
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl">
            <h3 className="text-sm text-gray-400">Live Matches</h3>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-2xl font-bold text-white">24</span>
              <span className="text-xs text-red-400 mb-1">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-4 space-y-2">
        <h2 className="text-sm font-semibold text-gray-400 px-3 mb-3">MAIN MENU</h2>
        {mainNav.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
      </div>

      {/* Stats & Analytics */}
      <div className="p-4 space-y-2">
        <h2 className="text-sm font-semibold text-gray-400 px-3 mb-3">ANALYTICS</h2>
        {statsNav.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
      </div>

      {/* Settings & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 border-t border-white/10">
        <NavLink item={{ label: 'Settings', icon: Settings, path: '/settings' }} />
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar; 
 
 