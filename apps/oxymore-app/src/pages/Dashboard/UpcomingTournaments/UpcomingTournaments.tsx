import React from "react";
import "./UpcomingTournaments.scss";
import { Eye } from "lucide-react";
import LiveIcon from "../../../assets/svg/live-icon.svg?react";
import { OXMButton } from "@oxymore/ui";

const tournaments = [
    {
        id: 1,
        title: "EU Dust II Clash",
        date: "June 28, 2025",
        format: "BO3 Format",
        img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
        live: true,
        views: "2.0K",
        tag: "Minor Tournament #2",
    },
    {
        id: 2,
        title: "CS2 Global Showdown 2025",
        date: "July 15, 2025",
        format: "Major",
        img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        live: false,
        views: "1.3K",
        tag: "Major Tournament",
    },
    {
        id: 3,
        title: "Oxymore NA Blitz Cup",
        date: "August 2, 2025",
        format: "Major",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        live: false,
        views: "3.1K",
        tag: "Major Tournament #1",
    },
];

const UpcomingTournaments = () => {
  return (
    <section className="upcoming-tournaments">
      <h2 className="section-title">Upcoming Tournaments</h2>
      <div className="cards">
        {tournaments.map((t, i) => (
          <div className="card" key={t.id}>
            <div className="card-image-container">
              <img src={t.img} alt={t.title} className="card-image" />
              {t.live && <div className="live-badge"><LiveIcon className="live-icon" /> Live</div>}
              <div className="views">
                <Eye size={14} /> <span>{t.views}</span>
              </div>
            </div>
            <div className="tag">
              Minor Tournament #2 <div className="dot" />
            </div>
            <div className="title">{t.title}</div>
            <hr className="card-separator" />
            <div className="meta">
              <span>{t.date}</span>
              <span>{t.format}</span>
            </div>
            <div className="card-buttons">
              <OXMButton>Register Now</OXMButton>
              <OXMButton variant="secondary">Tournament Details</OXMButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingTournaments;
