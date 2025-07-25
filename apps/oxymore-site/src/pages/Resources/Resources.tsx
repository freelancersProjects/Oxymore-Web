import { OXMGlowOrb, OXMButton } from "@oxymore/ui";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import "./Resources.scss";
import { useLanguage } from "../../context/LanguageContext";

const Resources = () => {
  const { t } = useLanguage();
  const resources = [
    {
      icon: <InsertPhotoIcon fontSize="inherit" />,
      title: t('resources.cards.brandAssets.title'),
      desc: t('resources.cards.brandAssets.desc'),
      action: (
        <a href="#" target="_blank" rel="noopener noreferrer" className="tdnone">
          <OXMButton size="large">{t('resources.cards.brandAssets.button')}</OXMButton>
        </a>
      )
    },
    {
      icon: <IntegrationInstructionsIcon fontSize="inherit" />,
      title: t('resources.cards.integrationGuides.title'),
      desc: t('resources.cards.integrationGuides.desc'),
      action: (
        <a href="#" target="_blank" rel="noopener noreferrer" className="tdnone">
          <OXMButton size="large">{t('resources.cards.integrationGuides.button')}</OXMButton>
        </a>
      )
    },
    {
      icon: <NewspaperIcon fontSize="inherit" />,
      title: t('resources.cards.pressKit.title'),
      desc: t('resources.cards.pressKit.desc'),
      action: (
        <a href="#" target="_blank" rel="noopener noreferrer" className="tdnone">
          <OXMButton size="large">{t('resources.cards.pressKit.button')}</OXMButton>
        </a>
      )
    },
    {
      icon: <SupportAgentIcon fontSize="inherit" />,
      title: t('resources.cards.support.title'),
      desc: t('resources.cards.support.desc'),
      action: (
        <a href="mailto:support@oxymore.gg" className="tdnone">
          <OXMButton size="large">{t('resources.cards.support.button')}</OXMButton>
        </a>
      )
    }
  ];
  return (
    <>
      <div className="resources-bg-animated" />
      <OXMGlowOrb top="-10%" left="-20%" size="900px" color="rgba(80,12,173,0.22)" />
      <section className="resources-page">
        <h1 className="orbitron resources-title-glow">{t('resources.title')}</h1>
        <p className="resources-subtitle outfit resources-subtitle-glow">
          {t('resources.subtitle')}
        </p>
        <div className="resources-grid">
          {resources.map((r) => (
            <div className="resource-card dream" key={r.title}>
              <div className="resource-icon dream-glow">{r.icon}</div>
              <h2 className="orbitron dream-title">{r.title}</h2>
              <p className="outfit dream-desc">{r.desc}</p>
              <div className="resource-action dream-action">{r.action}</div>
            </div>
          ))}
        </div>
      </section>
      <OXMGlowOrb bottom="-10%" right="-15%" size="1100px" color="rgba(21,147,206,0.18)" />
    </>
  );
};

export default Resources;
