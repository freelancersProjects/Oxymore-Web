import { useState, useEffect } from "react";
import { OXMButton } from "@oxymore/ui";
import { useLanguage } from "../../context/LanguageContext";
import windowsIcon from "../../assets/images/microsoft-windows.svg";
import macIcon from "../../assets/images/apple-mac.svg";
import linuxIcon from "../../assets/images/linux.png";
import "./Download.scss";

const PLATFORMS = [
  { 
    label: "platforms.windows", 
    value: "windows", 
    icon: windowsIcon, 
    file: "/downloads/Oxymore-Setup.exe",
    version: "1.2.0"
  },
  { 
    label: "platforms.macos", 
    value: "mac", 
    icon: macIcon, 
    file: "/downloads/Oxymore.dmg",
    version: "1.2.0"
  },
  { 
    label: "platforms.linux", 
    value: "linux", 
    icon: linuxIcon, 
    file: "/downloads/Oxymore.AppImage",
    version: "1.2.0"
  }
];

const FEATURES = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 21C3.95728 17.9237 6.41998 17 12 17C17.58 17 20.0427 17.9237 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "features.matchmaking.title",
    description: "features.matchmaking.description"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "features.ai.title",
    description: "features.ai.description"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M20 8L16.0811 12.1827C15.9326 12.3412 15.8584 12.4204 15.7688 12.4614C15.6897 12.4976 15.6026 12.5125 15.516 12.5047C15.4179 12.4958 15.3215 12.4458 15.1287 12.3457L11.8713 10.6543C11.6785 10.5542 11.5821 10.5042 11.484 10.4953C11.3974 10.4875 11.3103 10.5024 11.2312 10.5386C11.1416 10.5796 11.0674 10.6588 10.9189 10.8173L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "features.stats.title",
    description: "features.stats.description"
  }
];

const Download = () => {
  const { t } = useLanguage();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("win")) setSelectedPlatform("windows");
    else if (userAgent.includes("mac")) setSelectedPlatform("mac");
    else if (userAgent.includes("linux")) setSelectedPlatform("linux");
    else setSelectedPlatform("windows");
  }, []);

  const handleDownload = () => {
    if (!selectedPlatform) return;
    setIsDownloading(true);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setDownloadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsDownloading(false);
        setDownloadProgress(0);
        
        const platform = PLATFORMS.find(p => p.value === selectedPlatform);
        const link = document.createElement('a');
        link.href = platform?.file || '';
        link.download = `Oxymore-${t(`download.${platform?.label}`)}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 100);
  };

  return (
    <div className="download-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>
            {t("download.title.start")}
            <span className="gradient-text"> {t("download.title.end")}</span>
          </h1>
          <p className="hero-subtitle">
            {t("download.subtitle")}
          </p>

          <div className="platform-selector">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.value}
                className={`platform-button ${selectedPlatform === platform.value ? 'active' : ''}`}
                onClick={() => setSelectedPlatform(platform.value)}
              >
                <img src={platform.icon} alt={t(`download.${platform.label}`)} />
                <div className="platform-info">
                  <span className="platform-name">{t(`download.${platform.label}`)}</span>
                  <span className="platform-version">{platform.version}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="download-button">
            <OXMButton
              onClick={handleDownload}
              disabled={isDownloading}
              size="large"
            >
              {isDownloading ? (
                <div className="download-progress">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${downloadProgress}, 100`}
                    />
                  </svg>
                  <span>{downloadProgress}%</span>
                </div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t("download.download_button").replace("{platform}", t(`download.${PLATFORMS.find(p => p.value === selectedPlatform)?.label}`))}
                </>
              )}
            </OXMButton>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{t(`download.${feature.title}`)}</h3>
              <p>{t(`download.${feature.description}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Download;
