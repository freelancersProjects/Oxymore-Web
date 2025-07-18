import React from "react";
import { useLanguage } from "../../context/LanguageContext";

import "./LanguageSelector.scss";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useLanguage();

  const handleLanguageChange = (newLang: "fr" | "en") => {
    setLanguage(newLang);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${language === "fr" ? "active" : ""}`}
        onClick={() => handleLanguageChange("fr")}
        aria-label="Français"
      >
        {t("common.language.fr")}
      </button>
      <button
        className={`lang-btn ${language === "en" ? "active" : ""}`}
        onClick={() => handleLanguageChange("en")}
        aria-label="English"
      >
        {t("common.language.en")}
      </button>
    </div>
  );
};

export default LanguageSelector;
