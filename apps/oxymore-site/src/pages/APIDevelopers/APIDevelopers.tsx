import React from "react";
import { OXMButton, OXMCategorie } from "@oxymore/ui";
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

const useCases = [
  {
    icon: <CampaignIcon />,
    title: "Marketing & Advertising",
    description: "Engage audiences with dynamic visuals and insights.",
  },
  {
    icon: <SportsEsportsIcon />,
    title: "Game Development",
    description: "Build immersive games with robust API endpoints.",
  },
  {
    icon: <SchoolIcon />,
    title: "Education & Training",
    description: "Facilitate learning with automated data streams.",
  },
  {
    icon: <ShoppingCartIcon />,
    title: "E-Commerce",
    description: "Boost online stores with smart product data tools.",
  },
  {
    icon: <MovieCreationIcon />,
    title: "Film & Animation",
    description: "Power creative workflows with easy asset management.",
  },
  {
    icon: <CloudIcon />,
    title: "IT & SaaS",
    description: "Integrate Oxymore's API into your digital products.",
  },
];

const APIDevelopers = () => {
  return (
    <main className="api-dev">
      <section className="api-dev__hero">
        <div className="api-dev__hero-content">
          <OXMCategorie label="Oxymore API" />
          <h1 className="orbitron">
            Supercharge your projects <br />
            with the <span>Oxymore API</span>
          </h1>
          <p>
            Connect, automate and extend your ecosystem. Give your players
            unmatched tools and your devs the freedom they crave.
          </p>
          <div className="api-dev__hero-buttons">
            <OXMButton>API Documentation</OXMButton>
            <OXMButton variant="secondary">Contact Sales</OXMButton>
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
          <OXMCategorie label="Quick & Easy" />
          <h2 className="orbitron">Create your API key in lightning speed</h2>
          <p>
            Experience Oxymore's API with unmatched scalability and easy
            integration. Securely manage your API keys, monitor usage, and keep
            your data safe.
          </p>
          <OXMButton variant="secondary">Our API Documentation <ArrowForwardIcon /></OXMButton>
        </div>
      </section>

      <section className="api-dev__section api-dev__section--reversed">
        <div className="api-dev__section-content">
          <OXMCategorie label="Controlled Cost" />
          <h2 className="orbitron">Stay in control of your budget</h2>
          <p>
            Choose flexible plans and track usage in real-time. Customize your
            spend and scale your API needs without hassle.
          </p>
          <OXMButton>Build my First API Key</OXMButton>
        </div>
        <div className="api-dev__section-visual">
          <div className="visual-placeholder">
            <img src={APIKeyPremium} alt="API Key Premium" />
          </div>
        </div>
      </section>

      <section className="api-dev__use-cases">
        <OXMCategorie label="Use cases" />
        <h2 className="orbitron">An API tailored to your needs</h2>
        <p className="api-dev__use-cases-description">
          Oxymore's API fits multiple domains: gaming, automation, data, and
          more. Scale flexibly and adapt to market shifts seamlessly.
        </p>
        <div className="api-dev__use-cases-grid">
          {useCases.map((useCase, index) => (
            <div key={index} className="use-case-card">
              <div className="use-case-card__icon">{useCase.icon}</div>
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
