import React, { useState } from "react";
import { OXMButton, OXMPlayer } from "@oxymore/ui";
import "./HeroBanner.scss";

const videos = [
  {
    id: 1,
    title: "Ace on Bind – Semi Finals",
    subtitle: "Clutch 1v3 Victory",
    src: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837927/nkq4utl2MVJU99bLJiIZnw_picedm.mp4",
    poster: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837927/nkq4utl2MVJU99bLJiIZnw_picedm.jpg"
  },
  {
    id: 2,
    title: "Clutch 1v3 Victory",
    subtitle: "Ace on Mirage",
    src: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837925/CBT9pT35dI_lAYa0NBexqQ_q71khu.mp4",
    poster: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837925/CBT9pT35dI_lAYa0NBexqQ_q71khu.jpg"
  },
  {
    id: 3,
    title: "Perfect Nade – CS2",
    subtitle: "Double Knockout in Semi-Final",
    src: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837925/27Fk7HvcfJkD9Z1Z5eUU2Q_owiqb5.mp4",
    poster: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837925/27Fk7HvcfJkD9Z1Z5eUU2Q_owiqb5.jpg"
  },
  {
    id: 4,
    title: "Insane Flickshot",
    subtitle: "AWP highlight",
    src: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837924/9u-IFqXx4y1RKS9ej5r3jA_jokcbp.mp4",
    poster: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837924/9u-IFqXx4y1RKS9ej5r3jA_jokcbp.jpg"
  },
  {
    id: 5,
    title: "Tactical Outplay",
    subtitle: "Strategic Team Movement",
    src: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837924/xgKkzfRhiUqLVtBDnjMCKQ_d28nfb.mp4",
    poster: "https://res.cloudinary.com/dc94ncztl/video/upload/v1751837924/xgKkzfRhiUqLVtBDnjMCKQ_d28nfb.jpg"
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(0); // 0 = haut, 1 = bas
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);

  const nextIdx = (current + 1) % videos.length;

  const next = () => {
    setCurrent((prev) => (prev + 1) % videos.length);
    setSelected(0);
  };

  const handleVideoClick = (index: number) => {
    if (index === current) {
      setSelected(0);
    } else if (index === nextIdx) {
      setSelected(1);
    }
  };

  return (
    <section className="hero-banner">
      <video
        className="hero-banner__video"
        src={videos[current].src}
        poster={videos[current].poster}
        autoPlay
        loop={false}
        muted
        playsInline
        onEnded={() => { setCurrent((current + 1) % videos.length); setSelected(0); }}
      />
      <div className="hero-banner__overlay" />

      <div className="hero-banner__content">
        <div className="hero-banner__left">
          <span className="tag orbitron">CS2</span>
          <h1>Ace on Bind – Semi Finals</h1>
          <OXMButton onClick={() => setShowVisualizer(true)}>View Full Highlight</OXMButton>
          <p className="author">By: @ShadowSlayer</p>
        </div>

        <div className="hero-banner__right">
          {/* Carte du haut */}
          <div
            className={`thumb ${selected === 0 ? "active" : ""} ${hoveredIndex === 0 ? "hovered" : ""}`}
            onClick={() => handleVideoClick(current)}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ zIndex: 2 }}
          >
            <div className="player-icon">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.9286 7.99998L0.535731 15.7324L0.535731 0.267612L13.9286 7.99998Z"
                  fill="white"
                />
              </svg>
            </div>
            <video
              src={videos[current].src}
              poster={videos[current].poster}
              className="thumb-video"
              muted
              preload="metadata"
              style={{ width: "100%", borderRadius: 15, objectFit: "cover", height: '180px' }}
              onLoadedMetadata={e => (e.currentTarget.currentTime = 0.1)}
            />
            <h4>{videos[current].title}</h4>
            <p>{videos[current].subtitle}</p>
          </div>
          {/* Carte du bas */}
          <div
            className={`thumb ${selected === 1 ? "active" : ""} ${hoveredIndex === 1 ? "hovered" : ""}`}
            onClick={() => { setCurrent(nextIdx); setSelected(0); }}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ zIndex: 1 }}
          >
            <div className="player-icon">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.9286 7.99998L0.535731 15.7324L0.535731 0.267612L13.9286 7.99998Z"
                  fill="white"
                />
              </svg>
            </div>
            <video
              src={videos[nextIdx].src}
              poster={videos[nextIdx].poster}
              className="thumb-video"
              muted
              preload="metadata"
              style={{ width: "100%", borderRadius: 15, objectFit: "cover", height: '180px' }}
              onLoadedMetadata={e => (e.currentTarget.currentTime = 0.1)}
            />
            <h4>{videos[nextIdx].title}</h4>
            <p>{videos[nextIdx].subtitle}</p>
          </div>

          <div className="carousel-control">
            <span>
              {String(((current + selected) % videos.length) + 1).padStart(2, "0")}
              <span className="total">
                / {String(videos.length).padStart(2, "0")}
              </span>
            </span>
            <button onClick={next}>Next</button>
          </div>

          <div className="carousel-bar">
            <div
              className="carousel-bar__progress"
              style={{ width: `${((current + selected + 1) / videos.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <OXMPlayer
        open={showVisualizer}
        onClose={() => setShowVisualizer(false)}
        videoSrc={videos[current].src}
        title={videos[current].title}
        author={videos[current].subtitle}
      />
    </section>
  );
};

export default HeroBanner;
