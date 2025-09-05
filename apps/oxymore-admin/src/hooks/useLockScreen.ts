import { useState, useEffect } from 'react';

interface UseLockScreenReturn {
  isLocked: boolean;
  unlock: () => void;
  lock: () => void;
}

export const useLockScreen = (pageKey: string, defaultLocked: boolean = true): UseLockScreenReturn => {
  const [isLocked, setIsLocked] = useState(() => {
    // Vérifier si la page était déjà déverrouillée dans cette session
    const sessionKey = `lockScreen_${pageKey}`;
    const sessionValue = sessionStorage.getItem(sessionKey);
    return sessionValue !== 'unlocked' && defaultLocked;
  });

  const unlock = () => {
    setIsLocked(false);
    // Sauvegarder l'état de déverrouillage dans la session
    const sessionKey = `lockScreen_${pageKey}`;
    sessionStorage.setItem(sessionKey, 'unlocked');
  };

  const lock = () => {
    setIsLocked(true);
    // Supprimer l'état de déverrouillage de la session
    const sessionKey = `lockScreen_${pageKey}`;
    sessionStorage.removeItem(sessionKey);
  };

  // Réinitialiser le verrouillage quand l'utilisateur change de page
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Optionnel : verrouiller à nouveau quand l'utilisateur ferme l'onglet
      // lock();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return { isLocked, unlock, lock };
};
