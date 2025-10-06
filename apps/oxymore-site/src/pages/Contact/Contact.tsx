import { OXMButton, OXMGlowOrb } from "@oxymore/ui";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import "./Contact.scss";
import { useLanguage } from "../../context/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  return (
    <>
      <OXMGlowOrb top="10%" left="-15%" size="600px" color="rgba(80,12,173,0.25)" />
      <section className="contact-page">
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.subtitle')}</p>

        <div className="contact__content">
          <div className="contact__form">
            <h3>{t('contact.formTitle')}</h3>
            <form>
              <label htmlFor="name">{t('contact.form.name')}</label>
              <input type="text" id="name" placeholder={t('contact.form.namePlaceholder')} />

              <label htmlFor="email">{t('contact.form.email')}</label>
              <input type="email" id="email" placeholder={t('contact.form.emailPlaceholder')} />

              <label htmlFor="message">{t('contact.form.message')}</label>
              <textarea id="message" placeholder={t('contact.form.messagePlaceholder')}></textarea>

              <OXMButton>{t('contact.form.send')}</OXMButton>
            </form>
          </div>

          <div className="contact__info">
            <div className="contact__box">
              <h3>{t('contact.infoTitle')}</h3>
              <p>
                {t('contact.infoEmail')}:{" "}
                <a href="mailto:support@oxymore.gg">support@oxymore.gg</a>
              </p>
              <p>
                {t('contact.infoDiscord')}:{" "}
                <a
                  href="https://discord.gg/your-discord-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('contact.infoDiscordLink')}
                </a>
              </p>
            </div>

            <div className="contact__box">
              <h3>{t('contact.socialsTitle')}</h3>
              <div className="socials">
                <a href="#" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href="#" aria-label="Facebook">
                  <FacebookIcon />
                </a>
                <a href="#" aria-label="YouTube">
                  <YouTubeIcon />
                </a>
                <a href="#" aria-label="Twitch">
                  <SportsEsportsIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <OXMGlowOrb top="500px" right="-20%" size="900px" color="rgba(21,147,206,0.18)" />
    </>
  );
};

export default Contact;
