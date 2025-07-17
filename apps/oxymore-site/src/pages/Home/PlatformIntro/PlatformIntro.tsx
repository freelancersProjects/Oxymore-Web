import { OXMCategorie } from "@oxymore/ui";
import { useLanguage } from "../../../context/LanguageContext";
import "./PlatformIntro.scss";

const PlatformIntro = () => {
  const { t } = useLanguage();
  return (
    <section className="platform-intro">
      <OXMCategorie label={t('home.platformIntro.categorie')} />
      <h2>
        {t('home.platformIntro.title')} <span>{t('home.platformIntro.span')}</span>
      </h2>
    </section>
  );
};

export default PlatformIntro;
