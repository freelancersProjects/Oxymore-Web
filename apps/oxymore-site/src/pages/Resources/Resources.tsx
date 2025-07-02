import React from "react";
import { OXMGlowOrb, OXMButton } from "@oxymore/ui";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import "./Resources.scss";

const resources = [
  {
    icon: <InsertPhotoIcon fontSize="large" />, 
    title: "Brand Assets",
    desc: "Download our logos, color palette, and brand guidelines for your projects.",
    action: (
      <a href="#" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <OXMButton>Download Kit</OXMButton>
      </a>
    )
  },
  {
    icon: <IntegrationInstructionsIcon fontSize="large" />,
    title: "Integration Guides",
    desc: "Step-by-step guides to integrate Discord bots, widgets, and more.",
    action: (
      <a href="#" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <OXMButton>View Guides</OXMButton>
      </a>
    )
  },
  {
    icon: <NewspaperIcon fontSize="large" />,
    title: "Press Kit",
    desc: "Find press releases, company info, and media resources for journalists.",
    action: (
      <a href="#" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <OXMButton>Download Press Kit</OXMButton>
      </a>
    )
  },
  {
    icon: <SupportAgentIcon fontSize="large" />,
    title: "Support",
    desc: "Need help? Contact our team for fast support.",
    action: (
      <a href="mailto:support@oxymore.gg" style={{ textDecoration: 'none' }}>
        <OXMButton>Contact Support</OXMButton>
      </a>
    )
  }
];

const Resources = () => (
  <>
    <OXMGlowOrb top="-10%" left="-20%" size="700px" color="rgba(80,12,173,0.18)" />
    <section className="resources-page">
      <h1 className="orbitron">Resources</h1>
      <p className="resources-subtitle outfit">
        Find all the essential assets, guides, and support to make the most of Oxymore.
      </p>
      <div className="resources-grid">
        {resources.map((r, i) => (
          <div className="resource-card" key={r.title}>
            <div className="resource-icon">{r.icon}</div>
            <h2 className="orbitron">{r.title}</h2>
            <p className="outfit">{r.desc}</p>
            <div className="resource-action">{r.action}</div>
          </div>
        ))}
      </div>
    </section>
    <OXMGlowOrb bottom="-10%" right="-15%" size="900px" color="rgba(21,147,206,0.13)" />
  </>
);

export default Resources;
