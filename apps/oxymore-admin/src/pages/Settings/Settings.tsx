import React from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Volume2,
  VolumeX,
  Command,
  Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const Settings = () => {
  const { theme, setTheme, currentTheme } = useTheme();
  const [notificationSound, setNotificationSound] = React.useState(true);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Customize your admin panel experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Theme Settings */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="card-base p-4 md:p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 md:mb-6">Theme Preferences</h2>

            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4">
                  Choose Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = theme === option.value;
                    const isEffective = option.value === currentTheme || (option.value === 'system' && theme === 'system');

                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTheme(option.value as any)}
                        className={`p-3 md:p-4 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-gradient-oxymore border-transparent text-white shadow-oxymore'
                            : 'border-[var(--border-color)] hover:border-oxymore-purple text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2 md:gap-3">
                          <Icon className="w-5 h-5 md:w-6 md:h-6" />
                          <span className="font-medium text-sm md:text-base">{option.label}</span>
                          {isEffective && (
                            <span className="text-xs opacity-75">Currently Active</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-start gap-2 text-[var(--text-secondary)] text-sm">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed">
                    Press <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium">⌘</kbd> + <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium">D</kbd> to quickly toggle between light and dark themes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card-base p-4 md:p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 md:mb-6">Notification Settings</h2>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--overlay-hover)] flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Enable Notifications</p>
                    <p className="text-sm text-[var(--text-secondary)]">Get notified about important updates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-[var(--overlay-hover)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-oxymore-purple/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-oxymore-purple"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--overlay-hover)] flex items-center justify-center">
                    {notificationSound ? (
                      <Volume2 className="w-5 h-5 text-[var(--text-primary)]" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-[var(--text-primary)]" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Notification Sound</p>
                    <p className="text-sm text-[var(--text-secondary)]">Play a sound for notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSound}
                    onChange={(e) => setNotificationSound(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-[var(--overlay-hover)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-oxymore-purple/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-oxymore-purple"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-4 md:space-y-6">
          <div className="card-base p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Command className="w-5 h-5 text-oxymore-purple" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</h2>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors">
                <span className="text-[var(--text-primary)] text-sm md:text-base">Toggle Theme</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium text-[var(--text-primary)]">⌘</kbd>
                  <span className="text-[var(--text-secondary)]">+</span>
                  <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium text-[var(--text-primary)]">D</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors">
                <span className="text-[var(--text-primary)] text-sm md:text-base">Toggle Sidebar</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium text-[var(--text-primary)]">⌘</kbd>
                  <span className="text-[var(--text-secondary)]">+</span>
                  <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium text-[var(--text-primary)]">B</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors">
                <span className="text-[var(--text-primary)] text-sm md:text-base">Quick Search</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium text-[var(--text-primary)]">⌘</kbd>
                  <span className="text-[var(--text-secondary)]">+</span>
                  <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium text-[var(--text-primary)]">K</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--overlay-hover)] transition-colors">
                <span className="text-[var(--text-primary)] text-sm md:text-base">Show Shortcuts</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium text-[var(--text-primary)]">⌘</kbd>
                  <span className="text-[var(--text-secondary)]">+</span>
                  <kbd className="px-2 py-1 bg-[var(--overlay-hover)] border border-[var(--border-color)] rounded-lg text-xs font-medium text-[var(--text-primary)]">/</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

