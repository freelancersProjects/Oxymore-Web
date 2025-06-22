import React from "react";
import "./Footer.scss";
import Logo from "../../assets/logo.png";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitchIcon from '@mui/icons-material/SportsEsports';

const Footer = () => (
  <footer className="footer">
    <div className="footer__main">
      <div className="footer__brand">
        <img src={Logo} alt="Oxymore Logo" className="footer__logo" />
        <p className="footer__desc">
          Compete. Connect. Conquer.
          <br />A next-gen esports platform for players, teams, and communities.
        </p>
      </div>
      <div className="footer__links">
        <div className="footer__col">
          <h4>Quick Links</h4>
          <ul>
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
        </div>
        <div className="footer__col">
          <h4>About</h4>
          <ul>
            <li>
              <a href="#">Support</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Cookies Setting</a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Connect With Us</h4>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="#" aria-label="Facebook">
              <FacebookIcon fontSize="large" />
            </a>
            <a href="#" aria-label="YouTube">
              <YouTubeIcon fontSize="large" />
            </a>
            <a href="#" aria-label="Twitch">
              <TwitchIcon fontSize="large" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <hr className="footer__divider" />
    <div className="footer__copyright">
      © 2025 Oxymore. All rights reserved. Crafted for gamers, by gamers.
    </div>
  </footer>
);

export default Footer;
