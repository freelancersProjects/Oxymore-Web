import React, { createContext, useContext, useState, useEffect } from 'react';

interface MapPickerContextType {
  isOpen: boolean;
  openMapPicker: () => void;
  closeMapPicker: () => void;
  toggleMapPicker: () => void;
}

const MapPickerContext = createContext<MapPickerContextType | undefined>(undefined);

export const MapPickerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openMapPicker = () => setIsOpen(true);
  const closeMapPicker = () => setIsOpen(false);
  const toggleMapPicker = () => setIsOpen(prev => !prev);

  // Gestionnaire de raccourci clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        toggleMapPicker();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <MapPickerContext.Provider value={{ isOpen, openMapPicker, closeMapPicker, toggleMapPicker }}>
      {children}
    </MapPickerContext.Provider>
  );
};

export const useMapPicker = () => {
  const context = useContext(MapPickerContext);
  if (context === undefined) {
    throw new Error('useMapPicker must be used within a MapPickerProvider');
  }
  return context;
}; 
 
 