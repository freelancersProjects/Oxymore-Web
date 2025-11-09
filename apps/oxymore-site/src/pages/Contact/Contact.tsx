import { useState } from "react";
import { OXMButton, OXMGlowOrb } from "@oxymore/ui";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import "./Contact.scss";
import { useLanguage } from "../../context/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/email/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errorMessage = "Failed to send message";
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
          } catch {
            errorMessage = `Server error: ${response.status}`;
          }
        } else {
          errorMessage = `Server error: ${response.status}. Please make sure the backend is running.`;
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes("application/json")) {
        await response.json();
      }

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OXMGlowOrb top="10%" left="-15%" size="600px" color="rgba(80,12,173,0.25)" />
      <section className="contact-page">
        <h1>{t("contact.title")}</h1>
        <p>{t("contact.subtitle")}</p>

        <div className="contact__content">
          <div className="contact__form">
            <h3>{t("contact.formTitle")}</h3>
            {success && (
              <div className="contact__success">
                {t("contact.form.success") || "Message envoyé avec succès !"}
              </div>
            )}
            {error && <div className="contact__error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">{t("contact.form.name")}</label>
              <input
                type="text"
                id="name"
                placeholder={t("contact.form.namePlaceholder")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <label htmlFor="email">{t("contact.form.email")}</label>
              <input
                type="email"
                id="email"
                placeholder={t("contact.form.emailPlaceholder")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <label htmlFor="message">{t("contact.form.message")}</label>
              <textarea
                id="message"
                placeholder={t("contact.form.messagePlaceholder")}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>

              <OXMButton type="submit" disabled={loading}>
                {loading ? (t("contact.form.sending") || "Envoi...") : t("contact.form.send")}
              </OXMButton>
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
