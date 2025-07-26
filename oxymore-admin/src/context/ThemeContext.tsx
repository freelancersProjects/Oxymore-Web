import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark'; // Le thème effectif (jamais 'system')
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'system';
  });

  // Détermine le thème effectif basé sur le thème système si nécessaire
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  // Mettre à jour le thème dans le DOM et localStorage
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Toggle entre light et dark (ignore system)
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  };

  // Gestionnaire de raccourci clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTheme]);

  // Surveiller les changements de thème système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Définir le thème initial
    if (theme === 'system') {
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
    } else {
      setCurrentTheme(theme);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Appliquer le thème au DOM
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
 
 