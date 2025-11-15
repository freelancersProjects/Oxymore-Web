import { FC } from "react";
import loaderVideoWebm from "../../assets/video/OxymoreLoader_transparent.webm";
import "./Loader.scss";

interface LoaderProps {
  type?: "logo" | "normal" | "spinner";
  text?: string;
}

const OXMLoader: FC<LoaderProps> = ({ type = "logo", text = "" }) => {
  if (type === "logo") {
    return (
      <div className="oxm-loader-video">
        <div className="oxm-loader-video-wrapper">
          <video autoPlay loop muted playsInline preload="metadata">
            <source src={loaderVideoWebm} type="video/webm" />
          </video>

          <div className="oxm-loader-overlay">
            <span className="oxm-loader-text">
              Oxymore est en cours de chargement...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "spinner") {
    return (
      <div className="oxm-loader-spinner-container">
        <div className="oxm-loader-spinner-animated">
          <svg
            className="oxm-loader-spinner-svg"
            viewBox="0 0 100 100"
          >
            <circle
              className="oxm-loader-spinner-circle-base"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              className="oxm-loader-spinner-circle-wave"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              className="oxm-loader-spinner-circle-wave-2"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="oxm-loader-spinner-glow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="oxm-loader-simple">
      <div className="oxm-loader-spinner"></div>
      {text && <span className="oxm-loader-simple-text">{text}</span>}
    </div>
  );
};

export default OXMLoader;
