import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { OXMButton } from "@oxymore/ui";
import "./Header.scss";
import firstImage from "../../assets/images/first.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLHeadElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="header__logo" onClick={() => navigate("/")}>
        <img src={Logo} alt="Logo" style={{ cursor: "pointer" }} />
      </div>

      <button
        className={`header__burger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`header__nav ${menuOpen ? "active" : ""}`}>
        <ul className="header__nav-links">
          <li>
            <a onClick={() => navigate("/")}>Home</a>
          </li>
          <li>
            <a onClick={() => navigate("/about")}>About</a>
          </li>
          <li className="has-dropdown">
            <a>Learn</a>
            <div className="dropdown wide-dropdown">
              <div className="dropdown__image">
                <img
                  src="../../../src/assets/images/dropdown-image.webp"
                  alt="Learn illustration"
                />
              </div>
              <div className="dropdown__content">
                <ul>
                  <li>
                    <a onClick={() => navigate("/learn/create-tournament")}>
                      Create a Tournament
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/learn/integrate-api-discord")}>
                      Integrate API with Discord Bot
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/learn/resources")}>
                      Resources
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <a onClick={() => navigate("/developers/api")}>
              API for Developers
            </a>
          </li>
          <li className="header__nav-right">
            <a onClick={() => navigate("/contact")}>Contact</a>
          </li>
        </ul>
      </nav>

      <div className="header__auth">
        <a onClick={() => navigate("/signin")}>Sign In</a>
        <OXMButton
          onClick={() => {
            const link = document.createElement('a');
            link.href = firstImage;
            link.download = 'Oxymore-Image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download
        </OXMButton>
      </div>


    </header>
  );
};

export default Header;
