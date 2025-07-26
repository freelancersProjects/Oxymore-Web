import React, { createContext, useContext, useState, useEffect } from 'react';

interface LiveMatchContextType {
  isOpen: boolean;
  openLiveMatch: () => void;
  closeLiveMatch: () => void;
  toggleLiveMatch: () => void;
}

const LiveMatchContext = createContext<LiveMatchContextType | undefined>(undefined);

export const LiveMatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLiveMatch = () => setIsOpen(true);
  const closeLiveMatch = () => setIsOpen(false);
  const toggleLiveMatch = () => setIsOpen(prev => !prev);

  // Gestionnaire de raccourci clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        toggleLiveMatch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <LiveMatchContext.Provider value={{ isOpen, openLiveMatch, closeLiveMatch, toggleLiveMatch }}>
      {children}
    </LiveMatchContext.Provider>
  );
};

export const useLiveMatch = () => {
  const context = useContext(LiveMatchContext);
  if (context === undefined) {
    throw new Error('useLiveMatch must be used within a LiveMatchProvider');
  }
  return context;
}; 
 
 