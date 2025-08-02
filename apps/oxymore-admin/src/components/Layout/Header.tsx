import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Plus,
  Trophy,
  Target,
  Users,
  ChevronDown,
  LogOut,
  Settings,
  User
} from 'lucide-react';

const Header = () => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const notifications = [
    { title: 'New Tournament Registration', desc: 'Team_Alpha joined CS2 Major', time: '2 min ago' },
    { title: 'Match Starting Soon', desc: 'NextGen vs Team_Beta in 30min', time: '5 min ago' },
    { title: 'New Report', desc: 'User reported for toxic behavior', time: '1h ago' }
  ];

  const quickActions = [
    { label: 'New Tournament', icon: Trophy, color: 'bg-gradient-purple' },
    { label: 'New League', icon: Target, color: 'bg-gradient-blue' },
    { label: 'Add User', icon: Users, color: 'bg-gradient-oxymore' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-oxymore-dark-secondary/50 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-oxymore-purple/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Actions Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActions(!showActions)}
              className="bg-gradient-oxymore px-4 py-2 rounded-xl text-white font-semibold shadow-oxymore hover:shadow-oxymore-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Quick Actions</span>
            </motion.button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-oxymore-dark-secondary border border-white/10 rounded-xl shadow-oxymore overflow-hidden"
                >
                  <div className="p-2">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ x: 5 }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                          <action.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Bell className="w-5 h-5 text-white" />
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
                  className="absolute right-0 mt-2 w-80 bg-oxymore-dark-secondary border border-white/10 rounded-xl shadow-oxymore overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="p-2">
                    {notifications.map((notif, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 hover:bg-white/5 rounded-lg cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-oxymore rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{notif.title}</h4>
                            <p className="text-sm text-gray-400">{notif.desc}</p>
                            <span className="text-xs text-gray-500">{notif.time}</span>
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
              className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div className="hidden sm:block text-left">
                <h3 className="text-white font-medium">Admin</h3>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-oxymore-dark-secondary border border-white/10 rounded-xl shadow-oxymore overflow-hidden"
                >
                  <div className="p-2">
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

