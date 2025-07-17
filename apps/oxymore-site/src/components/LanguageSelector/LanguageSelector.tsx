import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSelector.scss';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: 'fr' | 'en') => {
    setLanguage(newLang);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('fr')}
        aria-label="Français"
      >
        🇫🇷 FR
      </button>
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
        aria-label="English"
      >
        🇬🇧 EN
      </button>
    </div>
  );
};

export default LanguageSelector;
