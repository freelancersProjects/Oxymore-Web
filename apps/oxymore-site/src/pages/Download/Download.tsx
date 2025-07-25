import { useState } from "react";
import { OXMButton, OXMDropdown } from "@oxymore/ui";
import { OXMCategorie } from "@oxymore/ui";
import windowsIcon from "../../assets/images/microsoft-windows.svg";
import macIcon from "../../assets/images/apple-mac.svg";
import linuxIcon from "../../assets/images/linux.png";
import "./Download.scss";

const PLATFORMS = [
  { label: "Windows", value: "windows", icon: windowsIcon, file: "/downloads/Oxymore-Setup.exe" },
  { label: "macOS", value: "mac", icon: macIcon, file: "/downloads/Oxymore.dmg" },
  { label: "Linux", value: "linux", icon: linuxIcon, file: "/downloads/Oxymore.AppImage" },
];

const FEATURES = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="24" cy="12" r="12" fill="#7c3aed" fillOpacity="0.18" />
        <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" stroke="#7c3aed" strokeWidth="2"/>
        <path d="M8 11h8M8 15h5" stroke="#1593CE" strokeWidth="2"/>
      </svg>
    ),
    title: "Tournois Dynamiques",
    desc: "Créez et participez à des tournois compétitifs avec matchmaking avancé."
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="24" cy="12" r="12" fill="#1593CE" fillOpacity="0.18" />
        <circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="2"/>
        <path d="M8 12h8M12 8v8" stroke="#1593CE" strokeWidth="2"/>
      </svg>
    ),
    title: "Intelligence Artificielle",
    desc: "Assistant IA intégré pour optimiser vos stratégies et analyser vos performances."
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="24" cy="12" r="12" fill="#7c3aed" fillOpacity="0.18" />
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="#7c3aed" strokeWidth="2"/>
        <path d="M8 16v-4a4 4 0 1 1 8 0v4" stroke="#1593CE" strokeWidth="2"/>
      </svg>
    ),
    title: "Statistiques Détaillées",
    desc: "Suivez vos progrès avec des analyses approfondies et des métriques personnalisées."
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="24" cy="12" r="12" fill="#1593CE" fillOpacity="0.18" />
        <rect x="3" y="7" width="18" height="10" rx="2" stroke="#7c3aed" strokeWidth="2"/>
        <path d="M7 12h10" stroke="#1593CE" strokeWidth="2"/>
      </svg>
    ),
    title: "API Complète",
    desc: "Intégrez Oxymore dans vos applications avec notre API RESTful documentée."
  }
];

const Download = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0].value);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const platform = PLATFORMS.find(p => p.value === selectedPlatform);
      const link = document.createElement('a');
      link.href = platform?.file || PLATFORMS[0].file;
      link.download = `Oxymore-${platform?.label || 'Windows'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 1000);
  };

  return (
    <div className="download-full-bg">
      <div className="download-overlay">
        <div className="download-main-card mega">
          <OXMCategorie label="Download Oxymore"></OXMCategorie>
          <h1 className="download-title mega">
            Téléchargez la plateforme Oxymore
          </h1>
          <p className="download-subtitle mega">
            Accédez à la nouvelle génération de gaming compétitif, IA, tournois
            et API, sur votre OS préféré.
          </p>
          <div className="download-platform-row mega">
            <OXMDropdown
              options={PLATFORMS}
              value={selectedPlatform}
              onChange={setSelectedPlatform}
              theme="blue"
            />
            <OXMButton
              onClick={handleDownload}
              disabled={isDownloading}
              size="large"
            >
              {isDownloading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15V3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Télécharger
                </>
              )}
            </OXMButton>
          </div>
          <div className="download-platform-icons mega">
            {PLATFORMS.map((p) => (
              <div
                key={p.value}
                className={`platform-icon-card mega${selectedPlatform === p.value ? ' selected' : ''}`}
                onClick={() => setSelectedPlatform(p.value)}
              >
                <div className="platform-icon-glass">
                  <img src={p.icon} alt={p.label} />
                </div>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION FEATURES */}
        <div className="download-features-row">
          {FEATURES.map((feature, idx) => (
            <div 
              className={`feature-block futurist-glow feature-block-animated feature-delay-${idx}`}
              key={feature.title}
            >
              <div className="feature-icon-anim">{feature.icon}</div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION REQUIREMENTS */}
        <div className="download-requirements-row">
          <div className="requirement-card futurist-glow">
            <h3>Windows</h3>
            <ul>
              <li>Windows 10/11 64 bits</li>
              <li>Intel i3 / Ryzen 3 ou supérieur</li>
              <li>4 Go RAM minimum</li>
              <li>500 Mo d'espace disque</li>
            </ul>
          </div>
          <div className="requirement-card futurist-glow">
            <h3>macOS</h3>
            <ul>
              <li>macOS 11 Big Sur ou supérieur</li>
              <li>Mac Intel ou Apple Silicon</li>
              <li>4 Go RAM minimum</li>
              <li>500 Mo d'espace disque</li>
            </ul>
          </div>
          <div className="requirement-card futurist-glow">
            <h3>Linux</h3>
            <ul>
              <li>Ubuntu 20.04+ / Debian 11+ / Fedora 36+</li>
              <li>Processeur x64</li>
              <li>4 Go RAM minimum</li>
              <li>500 Mo d'espace disque</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
