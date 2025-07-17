import "./Footer.scss";
import Logo from "../../assets/logo.png";
import { useLanguage } from "../../context/LanguageContext";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitchIcon from '@mui/icons-material/SportsEsports';

const Footer = () => {
  const { t } = useLanguage();

  return (
  <footer className="footer">
    <div className="footer__main">
      <div className="footer__brand">
        <img src={Logo} alt="Oxymore Logo" className="footer__logo" />
        <p className="footer__desc">
          {t('footer.description')}
        </p>
      </div>
      <div className="footer__links">
        <div className="footer__col">
          <h4>{t('footer.links.product')}</h4>
          <ul>
            <li>
              <a href="#">{t('nav.home')}</a>
            </li>
            <li>
              <a href="#">{t('nav.about')}</a>
            </li>
            <li>
              <a href="#">{t('nav.tournaments')}</a>
            </li>
            <li>
              <a href="#">{t('nav.resources')}</a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>{t('footer.links.company')}</h4>
          <ul>
            <li>
              <a href="#">{t('footer.links.support')}</a>
            </li>
            <li>
              <a href="#">{t('footer.links.developers')}</a>
            </li>
            <li>
              <a href="#">{t('footer.legal.terms')}</a>
            </li>
            <li>
              <a href="#">{t('footer.legal.privacy')}</a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>{t('footer.links.support')}</h4>
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
      {t('footer.copyright')}
    </div>
  </footer>
  );
};

export default Footer;
