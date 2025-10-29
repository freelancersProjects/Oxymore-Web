import { FC } from "react";
import loaderVideoWebm from "../../assets/video/OxymoreLoader_transparent.webm";
import "./Loader.scss";

interface LoaderProps {
  type?: "logo" | "normal";
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

  return (
    <div className="oxm-loader-simple">
      <div className="oxm-loader-spinner"></div>
      {text && <span className="oxm-loader-simple-text">{text}</span>}
    </div>
  );
};

export default OXMLoader;
