import { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { OXMButton } from "@oxymore/ui";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import "./Header.scss";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="header__logo" onClick={() => navigate("/")}>
        <img src={Logo} alt="Logo" className="logo" />
      </div>

      <button
        className={`header__burger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <div className="burger__line burger__line--1"></div>
        <div className="burger__line burger__line--2"></div>
        <div className="burger__line burger__line--3"></div>
      </button>

      <nav className="header__nav header__nav--desktop">
        <ul className="header__nav-links">
          <li>
            <a onClick={() => navigate("/")}>{t('nav.home')}</a>
          </li>
          <li>
            <a onClick={() => navigate("/about")}>{t('nav.about')}</a>
          </li>
          <li className="has-dropdown">
            <a>{t('nav.learn')}</a>
            <div className="dropdown wide-dropdown">
              <div className="dropdown__content">
                <ul>
                  <li>
                    <a onClick={() => navigate("/learn/create-tournament")}>{t('nav.joinTournament')}</a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/learn/resources")}>{t('nav.resources')}</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown__icon">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="7" width="32" height="24" rx="5" fill="#500cad" fillOpacity="0.13"/>
                  <rect x="7" y="11" width="24" height="16" rx="3" fill="#7c3aed" fillOpacity="0.22"/>
                  <path d="M11 15H27M11 19H27M11 23H21" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </li>
          <li>
            <a onClick={() => navigate("/developers/api")}>{t('nav.developers')}</a>
          </li>
          <li className="header__nav-right">
            <a onClick={() => navigate("/contact")}>{t('nav.contact')}</a>
          </li>
        </ul>
      </nav>

      <nav className={`header__nav header__nav--mobile ${menuOpen ? "active" : ""}`}>
        <div className="mobile-nav__content">
          <ul className="mobile-nav__links">
            <li>
              <a onClick={() => handleNavClick("/")}>{t('nav.home')}</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("/about")}>{t('nav.about')}</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("/learn/create-tournament")}>{t('nav.joinTournament')}</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("/learn/resources")}>{t('nav.resources')}</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("/developers/api")}>{t('nav.developers')}</a>
            </li>
            <li>
              <a onClick={() => handleNavClick("/contact")}>{t('nav.contact')}</a>
            </li>
          </ul>

          <div className="mobile-nav__auth">
            <LanguageSelector />
            <a className="mobile-nav__get-started">{t('common.getStarted')}</a>
            <OXMButton
              onClick={() => handleNavClick("/download")}
            >
              {t('common.download')}
            </OXMButton>
          </div>
        </div>
      </nav>

      {/* Auth Desktop */}
      <div className="header__auth">
        <LanguageSelector />
        <a>{t('common.getStarted')}</a>
        <OXMButton
          onClick={() => navigate("/download")}
        >
          {t('common.download')}
        </OXMButton>
      </div>
    </header>
  );
};

export default Header;
