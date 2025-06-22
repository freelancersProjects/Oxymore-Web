import React, { useEffect, useRef, useState } from "react";
import { OXMCategorie, OXMButton, OXMGlowOrb } from "@oxymore/ui";
import "./About.scss";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

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

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      description: "Former pro gamer turned entrepreneur, Alex has been in the esports industry for over 10 years."
    },
    {
      name: "Sarah Kim",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
      description: "Tech enthusiast with a passion for building scalable platforms that connect gamers worldwide."
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      description: "Creative director with 15+ years experience in gaming UI/UX and brand development."
    }
  ];

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
      title: "Excellence",
      description: "We strive for excellence in everything we do, from platform performance to user experience."
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
      title: "Community",
      description: "Building a strong, inclusive community where every gamer feels welcome and supported."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          <path d="M19 15L19.74 18.26L23 19L19.74 19.74L19 23L18.26 19.74L15 19L18.26 18.26L19 15Z" fill="currentColor"/>
        </svg>
      ),
      title: "Innovation",
      description: "Constantly pushing boundaries to create the next generation of esports experiences."
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
        </svg>
      ),
      title: "Performance",
      description: "Delivering lightning-fast, reliable performance that keeps you in the game."
    }
  ];

  return (
    <div className={`about ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section */}
      <section className="about__hero" ref={(el) => { sectionRefs.current[0] = el; }}>
        <div className="about__hero-content">
          <OXMCategorie label="About Oxymore" />
          <h1 className="orbitron">Building the Future of Esports</h1>
          <p className="about__hero-subtitle">
            We're on a mission to revolutionize competitive gaming by creating the most advanced,
            user-friendly esports platform that connects players, teams, and tournaments worldwide.
          </p>
          <div className="about__hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item" style={{ animationDelay: `${index * 0.2}s` }}>
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <h4>Tournaments</h4>
              <p>Daily competitions</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-content">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H21V5H3V3ZM3 7H21V9H3V7ZM3 11H21V13H3V11ZM3 15H21V17H3V15ZM3 19H21V21H3V19Z" fill="currentColor"/>
                </svg>
              </div>
              <h4>Analytics</h4>
              <p>Real-time stats</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-content">
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4C16 5.10457 15.1046 6 14 6C12.8954 6 12 5.10457 12 4C12 2.89543 12.8954 2 14 2C15.1046 2 16 2.89543 16 4Z" fill="currentColor"/>
                  <path d="M22 12C22 13.1046 21.1046 14 20 14C18.8954 14 18 13.1046 18 12C18 10.8954 18.8954 10 20 10C21.1046 10 22 10.8954 22 12Z" fill="currentColor"/>
                  <path d="M8 20C8 21.1046 7.10457 22 6 22C4.89543 22 4 21.1046 4 20C4 18.8954 4.89543 18 6 18C7.10457 18 8 18.8954 8 20Z" fill="currentColor"/>
                </svg>
              </div>
              <h4>Community</h4>
              <p>Global network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about__mission" ref={(el) => { sectionRefs.current[1] = el; }}>
        <div className="about__mission-content">
          <div className="mission-text">
            <h2 className="orbitron">Our Mission</h2>
            <p>
              To democratize esports by providing every gamer, regardless of skill level or location,
              access to professional-grade competitive experiences. We believe that talent should be
              the only barrier to entry in competitive gaming.
            </p>
            <p>
              Through cutting-edge technology, intuitive design, and unwavering commitment to our
              community, we're building the platform that will define the future of esports.
            </p>
          </div>
          <div className="mission-visual">
            <div className="mission-graphic">
              <div className="graphic-circle circle-1"></div>
              <div className="graphic-circle circle-2"></div>
              <div className="graphic-circle circle-3"></div>
              <div className="graphic-center">
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about__values" ref={(el) => { sectionRefs.current[2] = el; }}>
        <OXMCategorie label="Our Values" />
        <h2 className="orbitron">What Drives Us Forward</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <div
              key={index}
              className="value-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="value-icon">{value.icon}</div>
              <h3 className="orbitron">{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="about__team" ref={(el) => { sectionRefs.current[3] = el; }}>
        <OXMCategorie label="Meet Our Team" />
        <h2 className="orbitron">The Minds Behind Oxymore</h2>
        <p className="team-intro">
          Our diverse team brings together expertise from gaming, technology, design, and community building
          to create something truly special.
        </p>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="team-member"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="member-image">
                <div className="member-avatar">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="member-overlay">
                  <div className="social-links">
                    <a href="#" className="social-link">LinkedIn</a>
                    <a href="#" className="social-link">Twitter</a>
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

      {/* Story Section */}
      <section className="about__story" ref={(el) => { sectionRefs.current[4] = el; }}>
        <div className="story-content">
          <div className="story-text">
            <OXMCategorie label="Our Story" />
            <h2 className="orbitron">From Dream to Reality</h2>
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2020 - The Beginning</h4>
                  <p>Founded by a group of passionate gamers who saw the potential for a better esports platform.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2021 - First Launch</h4>
                  <p>Released our beta platform with basic tournament functionality and community features.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2022 - Growth & Innovation</h4>
                  <p>Expanded to support multiple games, introduced advanced analytics, and reached 10K users.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2023 - Global Expansion</h4>
                  <p>Launched in new markets, introduced mobile app, and partnered with major esports organizations.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2024 - The Future</h4>
                  <p>Continuing to innovate with AI-powered features, VR integration, and blockchain technology.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about__cta" ref={(el) => { sectionRefs.current[5] = el; }}>
        <div className="cta-content">
          <h2 className="orbitron">Ready to Join the Revolution?</h2>
          <p>
            Be part of the future of esports. Create your account today and start competing
            in tournaments, building your team, and climbing the ranks.
          </p>
          <div className="cta-buttons">
            <OXMButton size="large">Get Started Free</OXMButton>
            <a href="/contact" className="cta-link">Contact Us</a>
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
