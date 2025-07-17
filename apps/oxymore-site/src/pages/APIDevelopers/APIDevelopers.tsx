import { OXMButton, OXMCategorie } from "@oxymore/ui";
import { useLanguage } from "../../context/LanguageContext";
import Herobannerimage from "../../assets/images/APIKeys.webp";
import APIkey from "../../assets/images/modal-generate-key.webp";
import APIKeyPremium from "../../assets/images/APIKeyPremium.webp";

import CampaignIcon from "@mui/icons-material/Campaign";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SchoolIcon from "@mui/icons-material/School";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudIcon from "@mui/icons-material/Cloud";

import "./APIDevelopers.scss";

const useCasesIcons = [
  <CampaignIcon />, <SportsEsportsIcon />, <SchoolIcon />, <ShoppingCartIcon />, <MovieCreationIcon />, <CloudIcon />
];

const APIDevelopers = () => {
  const { t, translations } = useLanguage();
  const useCases =
    (translations as any).api?.useCases ||
    (translations as any).developers?.api?.useCases ||
    [];

  return (
    <main className="api-dev">
      <section className="api-dev__hero">
        <div className="api-dev__hero-content">
          <OXMCategorie label={t('api.categorie')} />
          <h1 className="orbitron" dangerouslySetInnerHTML={{ __html: t('api.heroTitle') }} />
          <p>{t('api.heroDesc')}</p>
          <div className="api-dev__hero-buttons">
            <OXMButton>{t('api.docBtn')}</OXMButton>
            <OXMButton variant="secondary">{t('api.salesBtn')}</OXMButton>
          </div>
        </div>
        <div className="api-dev__hero-visual">
          <img src={Herobannerimage} alt="Oxymore API dashboard" />
        </div>
      </section>

      <section className="api-dev__section">
        <div className="api-dev__section-visual">
          <div className="visual-placeholder">
            <img src={APIkey} alt="API Key Generation" />
          </div>
        </div>
        <div className="api-dev__section-content">
          <OXMCategorie label={t('api.quickCategorie')} />
          <h2 className="orbitron">{t('api.quickTitle')}</h2>
          <p>{t('api.quickDesc')}</p>
          <OXMButton variant="secondary">{t('api.quickDocBtn')} <ArrowForwardIcon /></OXMButton>
        </div>
      </section>

      <section className="api-dev__section api-dev__section--reversed">
        <div className="api-dev__section-content">
          <OXMCategorie label={t('api.costCategorie')} />
          <h2 className="orbitron">{t('api.costTitle')}</h2>
          <p>{t('api.costDesc')}</p>
          <OXMButton>{t('api.costBtn')}</OXMButton>
        </div>
        <div className="api-dev__section-visual">
          <div className="visual-placeholder">
            <img src={APIKeyPremium} className="left-placeholder" alt="API Key Premium" />
          </div>
        </div>
      </section>

      <section className="api-dev__use-cases">
        <OXMCategorie label={t('api.useCasesCategorie')} />
        <h2 className="orbitron">{t('api.useCasesTitle')}</h2>
        <p className="api-dev__use-cases-description">
          {t('api.useCasesDesc')}
        </p>
        <div className="api-dev__use-cases-grid">
          {useCases.map((useCase: any, index: number) => (
            <div key={index} className="use-case-card">
              <div className="use-case-card__icon">{useCasesIcons[index]}</div>
              <h3 className="orbitron">{useCase.title}</h3>
              <p>{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default APIDevelopers;
