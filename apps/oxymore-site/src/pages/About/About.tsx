import { useEffect, useRef, useState } from "react";
import { OXMCategorie, OXMButton, OXMGlowOrb } from "@oxymore/ui";
import { useLanguage } from "../../context/LanguageContext";
import "./About.scss";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const { t, translations } = useLanguage();
  const teamMembers = (translations.about.team as any).members;

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: "50K+", label: "Active Players" },
    { number: "500+", label: "Tournaments" },
    { number: "$2M+", label: "Prize Pools" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  const values = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          <path d="M19 15L19.74 18.26L23 19L19.74 19.74L19 23L18.26 19.74L15 19L18.26 18.26L19 15Z" fill="currentColor"/>
          <path d="M5 6L5.37 7.63L7 8L5.37 8.37L5 10L4.63 8.37L3 8L4.63 7.63L5 6Z" fill="currentColor"/>
        </svg>
      ),
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4C16 5.10457 15.1046 6 14 6C12.8954 6 12 5.10457 12 4C12 2.89543 12.8954 2 14 2C15.1046 2 16 2.89543 16 4Z" fill="currentColor"/>
          <path d="M22 12C22 13.1046 21.1046 14 20 14C18.8954 14 18 13.1046 18 12C18 10.8954 18.8954 10 20 10C21.1046 10 22 10.8954 22 12Z" fill="currentColor"/>
          <path d="M8 20C8 21.1046 7.10457 22 6 22C4.89543 22 4 21.1046 4 20C4 18.8954 4.89543 18 6 18C7.10457 18 8 18.8954 8 20Z" fill="currentColor"/>
          <path d="M12 8L18 12L12 16L6 12L12 8Z" fill="currentColor"/>
        </svg>
      ),
      title: t('about.values.community.title'),
      description: t('about.values.community.description')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          <path d="M19 15L19.74 18.26L23 19L19.74 19.74L19 23L18.26 19.74L15 19L18.26 18.26L19 15Z" fill="currentColor"/>
        </svg>
      ),
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
        </svg>
      ),
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description')
    }
  ];

  return (
    <div className={`about ${isVisible ? "visible" : ""}`}>
      {/* Hero Section */}
      <section
        className={`about__hero${activeSection === 0 ? " active" : ""}`}
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
      >
        <div className="about__hero-content">
          <OXMCategorie label={t("about.title")} />
          <h1 className="orbitron">{t("about.title")}</h1>
          <p className="about__hero-subtitle">{t("about.mission.content")}</p>
          <div className="about__hero-stats">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`stat-item stat-delay-${index}`}
              >
                <span className="stat-number orbitron">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="about__hero-visual">
          <div className="floating-card card-1">
            <div className="card-content">
              <div className="card-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h4>{t('about.hero.tournaments')}</h4>
              <p>{t('about.hero.tournamentsDesc')}</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-content">
              <div className="card-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3H21V5H3V3ZM3 7H21V9H3V7ZM3 11H21V13H3V11ZM3 15H21V17H3V15ZM3 19H21V21H3V19Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h4>{t('about.hero.analytics')}</h4>
              <p>{t('about.hero.analyticsDesc')}</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-content">
              <div className="card-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 4C16 5.10457 15.1046 6 14 6C12.8954 6 12 5.10457 12 4C12 2.89543 12.8954 2 14 2C15.1046 2 16 2.89543 16 4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M22 12C22 13.1046 21.1046 14 20 14C18.8954 14 18 13.1046 18 12C18 10.8954 18.8954 10 20 10C21.1046 10 22 10.8954 22 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8 20C8 21.1046 7.10457 22 6 22C4.89543 22 4 21.1046 4 20C4 18.8954 4.89543 18 6 18C7.10457 18 8 18.8954 8 20Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h4>{t('about.hero.community')}</h4>
              <p>{t('about.hero.communityDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`about__mission${activeSection === 1 ? " active" : ""}`}
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
      >
        <div className="about__mission-content">
          <div className="mission-text">
            <h2 className="orbitron">{t("about.mission.title")}</h2>
            <p>{t("about.mission.content")}</p>
            <p>{t("about.vision.content")}</p>
          </div>
          <div className="mission-visual">
            <div className="mission-graphic">
              <div className="graphic-circle circle-1"></div>
              <div className="graphic-circle circle-2"></div>
              <div className="graphic-circle circle-3"></div>
              <div className="graphic-center"></div>
            </div>
            <OXMGlowOrb right="1800px" top="55%" size="340px" color="#1593CE" />
          </div>
        </div>
      </section>

      <section
        className={`about__values${activeSection === 2 ? " active" : ""}`}
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
      >
        <OXMCategorie label={t("about.values.title")} />
        <h2 className="orbitron">{t("about.values.title")}</h2>
        <div className="values-grid">
                      {values.map((value, index) => (
              <div
                key={index}
                className={`value-card value-delay-${index}`}
              >
              <div className="value-icon">{value.icon}</div>
              <h3 className="orbitron">{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Team */}
      <section
        className={`about__team${activeSection === 3 ? " active" : ""}`}
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
      >
        <OXMCategorie label={t('about.team.categorie')} />
        <h2 className="orbitron">{t('about.team.title')}</h2>
        <p className="team-intro">{t('about.team.intro')}</p>
        <div className="team-grid">
          {teamMembers.map((member: any, index: number) => (
            <div
              key={index}
              className={`team-member team-delay-${index}`}
            >
              <div className="member-image">
                <div className="member-avatar">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="member-overlay">
                  <div className="social-links">
                    <a href="#" className="social-link">
                      LinkedIn
                    </a>
                    <a href="#" className="social-link">
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
              <div className="member-info">
                <h3 className="orbitron">{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <p>{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section
        className={`about__story${activeSection === 4 ? " active" : ""}`}
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
      >
        <div className="story-content">
          <div className="story-text">
            <OXMCategorie label={t('about.story.categorie')} />
            <h2 className="orbitron">{t('about.story.title')}</h2>
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t('about.story.timeline.2020.title')}</h4>
                  <p>{t('about.story.timeline.2020.desc')}</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t('about.story.timeline.2021.title')}</h4>
                  <p>{t('about.story.timeline.2021.desc')}</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t('about.story.timeline.2022.title')}</h4>
                  <p>{t('about.story.timeline.2022.desc')}</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t('about.story.timeline.2023.title')}</h4>
                  <p>{t('about.story.timeline.2023.desc')}</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{t('about.story.timeline.2024.title')}</h4>
                  <p>{t('about.story.timeline.2024.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`about__cta${activeSection === 5 ? " active" : ""}`}
        ref={(el) => {
          sectionRefs.current[5] = el;
        }}
      >
        <div className="cta-content">
          <h2 className="orbitron">{t('about.cta.title')}</h2>
          <p>{t('about.cta.desc')}</p>
          <div className="cta-buttons">
            <OXMButton size="large">{t('about.cta.getStarted')}</OXMButton>
            <a href="/contact" className="cta-link">
              {t('about.cta.contact')}
            </a>
          </div>
        </div>
        <div className="cta-visual">
          <div className="cta-graphic">
            <div className="graphic-element element-1"></div>
            <div className="graphic-element element-2"></div>
            <div className="graphic-element element-3"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
