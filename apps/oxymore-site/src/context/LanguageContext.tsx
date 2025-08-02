import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

type Language = 'fr' | 'en';
type Translations = typeof fr;

interface LanguageContextType {
  language: Language;
  setLanguage: (_lang: Language) => void;
  t: (_key: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr,
  en
};

const getDefaultLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('fr')) {
    return 'fr';
  }

  return 'en';
};

const getTranslation = (obj: any, key: string): string => {
  const keys = key.split('.');
  let result = obj;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key;
    }
  }

  return typeof result === 'string' ? result : key;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('oxymore-language') as Language;
    return savedLang && (savedLang === 'fr' || savedLang === 'en') ? savedLang : getDefaultLanguage();
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('oxymore-language', lang);
  };

  const t = (key: string): string => {
    return getTranslation(translations[language], key);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    translations: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
