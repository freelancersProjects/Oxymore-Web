import { OXMGlowOrb, OXMButton } from "@oxymore/ui";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import "./Resources.scss";

const resources = [
  {
    icon: <InsertPhotoIcon fontSize="inherit" />,
    title: "Brand Assets",
    desc: "Download our logos, color palette, and brand guidelines for your projects.",
    action: (
      <a href="#" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <OXMButton size="large">Download Kit</OXMButton>
      </a>
    )
  },
  {
    icon: <IntegrationInstructionsIcon fontSize="inherit" />,
    title: "Integration Guides",
    desc: "Step-by-step guides to integrate Discord bots, widgets, and more.",
    action: (
      <a href="#" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <OXMButton size="large">View Guides</OXMButton>
      </a>
    )
  },
  {
    icon: <NewspaperIcon fontSize="inherit" />,
    title: "Press Kit",
    desc: "Find press releases, company info, and media resources for journalists.",
    action: (
      <a href="#" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <OXMButton size="large">Download Press Kit</OXMButton>
      </a>
    )
  },
  {
    icon: <SupportAgentIcon fontSize="inherit" />,
    title: "Support",
    desc: "Need help? Contact our team for fast support.",
    action: (
      <a href="mailto:support@oxymore.gg" style={{ textDecoration: 'none' }}>
        <OXMButton size="large">Contact Support</OXMButton>
      </a>
    )
  }
];

const Resources = () => (
  <>
    <div className="resources-bg-animated" />
    <OXMGlowOrb top="-10%" left="-20%" size="900px" color="rgba(80,12,173,0.22)" />
    <section className="resources-page">
      <h1 className="orbitron resources-title-glow">Resources</h1>
      <p className="resources-subtitle outfit resources-subtitle-glow">
        Find all the essential assets, guides, and support to make the most of Oxymore.
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

export default Resources;
