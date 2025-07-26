import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameSelectorContextType {
  isOpen: boolean;
  openGameSelector: () => void;
  closeGameSelector: () => void;
}

const GameSelectorContext = createContext<GameSelectorContextType | undefined>(undefined);

export const useGameSelector = () => {
  const context = useContext(GameSelectorContext);
  if (!context) {
    throw new Error('useGameSelector must be used within a GameSelectorProvider');
  }
  return context;
};

export const GameSelectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'g') {
        event.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openGameSelector = () => setIsOpen(true);
  const closeGameSelector = () => setIsOpen(false);

  return (
    <GameSelectorContext.Provider value={{ isOpen, openGameSelector, closeGameSelector }}>
      {children}
    </GameSelectorContext.Provider>
  );
}; 