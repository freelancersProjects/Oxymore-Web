import { FC } from "react";
import loaderVideoWebm from "../../assets/video/OxymoreLoader.webm";
import loaderVideoMp4 from "../../assets/video/OxymoreLoader.mp4";
import "./Loader.scss";

const OXMLoader: FC = () => {
  return (
    <div className="oxm-loader-video">
      <div className="oxm-loader-video-wrapper">
        <video autoPlay loop muted playsInline preload="metadata">
          <source src={loaderVideoWebm} type="video/webm" />
          <source src={loaderVideoMp4} type="video/mp4" />
        </video>

        {/* Overlay avec texte */}
        <div className="oxm-loader-overlay">
          <span className="oxm-loader-text">
            Oxymore est en cours de chargement...
          </span>
        </div>
      </div>
    </div>
  );
};

export default OXMLoader;
