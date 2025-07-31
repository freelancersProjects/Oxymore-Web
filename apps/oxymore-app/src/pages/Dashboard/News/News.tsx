import "./News.scss";
import SoldierOverlay from "../../../assets/images/imagenewscsgo2.webp";
import { OXMButton } from "@oxymore/ui";

const News = () => {
  return (
    <div className="news-layout">
      <div className="tournament-card">
        <div className="background-image" />
        <img src={SoldierOverlay} alt="Soldiers" className="overlay-img" />
        <div className="tournament-content">
          <h2 className="tournament-title">Join Your First Tournament</h2>
          <p className="tournament-desc">
            Browse and join tournaments to get started with your competitive
            journey.
          </p>
          <OXMButton>View Tournaments</OXMButton>
        </div>
      </div>

      <div className="news-side">
        <h3 className="news-side-title">What’s New at Oxymore?</h3>

        <div className="news-box">
          <h4>New CS2 Patch Notes – June 2025</h4>
          <p>
            Valve just dropped a new update with key balance changes and
            performance fixes.
          </p>
          <span className="read-more">Read More</span>
        </div>

        <div className="news-box">
          <h4>Oxymore Summer Clash Announced!</h4>
          <p>
            Get ready for our biggest tournament of the season, featuring a
            massive prize pool and new formats.
          </p>
          <span className="read-more">Read More</span>
        </div>

        <div className="news-box faded">
          <h4>Top 5 Plays of the Week</h4>
          <p>
            Catch the most insane clutches and outplays shared by our players
            this week!
          </p>
        </div>
      </div>
    </div>
  );
};

export default News;
