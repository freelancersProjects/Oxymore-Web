import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/logo.png";
import { OXMButton } from "@oxymore/ui";
import "./Header.scss";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLHeadElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`header${scrolled ? " scrolled" : ""}`}
      ref={headerRef}
    >
      <div className="header__logo">
        <img src={Logo} alt="Logo" />
      </div>
      <nav className="header__nav">
        <ul className="header__nav-links">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Tournaments</a>
          </li>
          <li>
            <a href="#">Leagues</a>
          </li>
          <li>
            <a href="#">Teams</a>
          </li>
        </ul>
      </nav>
      <div className="header__auth">
        <a href="#">Sign In</a>
        <OXMButton>Create Account</OXMButton>
      </div>
    </header>
  );
};

export default Header;
