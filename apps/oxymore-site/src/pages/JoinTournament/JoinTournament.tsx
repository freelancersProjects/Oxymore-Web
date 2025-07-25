import { OXMGlowOrb } from "@oxymore/ui";
import quadrillage from "../../assets/images/quadrillage.png";
import first from "../../assets/images/first.png";
import second from "../../assets/images/second.png";
import third from "../../assets/images/third.png";
import "./JoinTournament.scss";

const JoinTournament = () => {
  return (
    <div className="create-tournament-page">
      <OXMGlowOrb
        top="-10%"
        left="-15%"
        size="700px"
        color="rgba(80,12,173,0.18)"
      />
      <OXMGlowOrb
        bottom="-10%"
        right="-10%"
        size="900px"
        color="rgba(21,147,206,0.13)"
      />
      <img src={quadrillage} alt="background grid" className="bracket-bg" />
      <header className="create-tournament-header">
        <h1 className="orbitron">Create Your Tournament</h1>
        <p className="outfit">
          Design your own bracket, invite teams, and make your event legendary.
        </p>
      </header>
      <div className="bracket-svg-container">
        <svg viewBox="0 0 1200 300" className="bracket-svg">
          <polyline
            points="50,50 300,50 300,150 600,150 600,250 1150,250"
            fill="none"
            stroke="#1593ce"
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="50" cy="50" r="18" fill="#1593ce" opacity="0.7" />
          <circle cx="300" cy="50" r="14" fill="#fff" opacity="0.5" />
          <circle cx="300" cy="150" r="14" fill="#fff" opacity="0.5" />
          <circle cx="600" cy="150" r="14" fill="#fff" opacity="0.5" />
          <circle cx="600" cy="250" r="14" fill="#fff" opacity="0.5" />
          <circle cx="1150" cy="250" r="18" fill="#1593ce" opacity="0.7" />
        </svg>
        <img src={first} alt="trophy" className="bracket-img bracket-img-1" />
        <img src={second} alt="team" className="bracket-img bracket-img-2" />
        <img src={third} alt="team" className="bracket-img bracket-img-3" />
      </div>
      <div className="tournament-glass">
        <h2 className="orbitron">Tournament Builder (coming soon)</h2>
        <p className="outfit">
          Visualize your bracket, add teams, and customize your event. Stay
          tuned!
        </p>
      </div>
    </div>
  );
};

export default JoinTournament;
