import React, { useState } from "react";
import { OXMButton, OXMCategorie } from "@oxymore/ui";
import "./HeroBanner.scss";

const videos = [
  {
    id: 1,
    title: "Final Kill – CS2",
    subtitle: "Clutch 1v3 Victory",
    thumb: "/assets/thumb1.jpg",
  },
  {
    id: 2,
    title: "Perfect Nade – CS2",
    subtitle: "Double Knockout in Semi-Final",
    thumb: "/assets/thumb2.jpg",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const next = () => {
    setCurrent((prev) => (prev + 1) % videos.length);
  };

  const handleVideoClick = (index: number) => {
    setCurrent(index);
  };

  return (
    <section className="hero-banner">
      <video
        className="hero-banner__video"
        src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="hero-banner__overlay" />

      <div className="hero-banner__content">
        <div className="hero-banner__left">
          <span className="tag orbitron">CS2</span>
          <h1>Ace on Bind – Semi Finals</h1>
          <OXMButton>View Full Highlight</OXMButton>
          <p className="author">By: @ShadowSlayer</p>
        </div>

        <div className="hero-banner__right">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className={`thumb ${index === current ? "active" : ""} ${
                index === hoveredIndex ? "hovered" : ""
              }`}
              onClick={() => handleVideoClick(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
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
              <img
                src={`https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80`}
                alt={video.title}
              />
              <h4>{video.title}</h4>
              <p>{video.subtitle}</p>
            </div>
          ))}

          <div className="carousel-control">
            <span>
              {String(current + 1).padStart(2, "0")}
              <span className="total">
                / {String(videos.length).padStart(2, "0")}
              </span>
            </span>
            <button onClick={next}>Next</button>
          </div>

          <div className="carousel-bar">
            <div
              className="carousel-bar__progress"
              style={{ width: `${((current + 1) / videos.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
